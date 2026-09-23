package main

import (
	"context"
	"flag"
	"log/slog"
	"os"
	"os/signal"
	"strings"

	"github.com/eduardokairalla1/EcoaNetwork/internal/p2p"
)


// --- GLOBALS ---



// --- CODE ---

func main() {
	network := flag.String("network",
						   "ecoa-dev",
						   "network this node belongs to")

	listen := flag.String("listen",
						  "/ip4/127.0.0.1/tcp/4001",
						  "multiaddr to listen on")

	bootstrapAddrs := flag.String(
		"bootstrap",
		"",
		"comma-separated peer multiaddrs; replaces the default list",
	)

	publish := flag.String("publish",
						   "",
						   "event file to publish after connecting")
	flag.Parse()

	addrs := p2p.DefaultBootstrapAddrs

	// The flag replaces the default list, it does not extend it.
	if *bootstrapAddrs != "" {
		addrs = strings.Split(*bootstrapAddrs, ",")
	}

	// The composition root installs the default logger.
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	p, err := p2p.New(
		ctx,
		p2p.Config{
			Network:        *network,
			Listen:         *listen,
			BootstrapAddrs: addrs,
		},
	)

	if err != nil {
		slog.Error("start", "err", err)
		os.Exit(1)
	}
	defer p.Close()

	go p.Run(ctx)

	slog.Info("joined", "topic", p2p.Topic(*network))

	for _, addr := range p.Addrs() {
		slog.Info("listening", "addr", addr)
	}

	if *publish != "" {
		raw, err := os.ReadFile(*publish)
		if err != nil {
			slog.Error("read event", "err", err)
			os.Exit(1)
		}

		if err := p.WaitForPeers(ctx); err != nil {
			slog.Error("wait for peers", "err", err)
			os.Exit(1)
		}

		if err := p.Publish(ctx, raw); err != nil {
			slog.Error("publish", "err", err)
		}
	}

	<-ctx.Done()
}
