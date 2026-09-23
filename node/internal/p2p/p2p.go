// Package p2p connects the node to its peers: a libp2p host and Gossipsub on
// the network's single topic.
package p2p


import (
	"context"
	"log/slog"

	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
)


// --- CODE ---

// Topic returns the Gossipsub topic for a network: one topic per network,
// carrying every event type.
func Topic(network string) string {
	return "/" + network + "/events/1"
}


// connectBootstrap dials every bootstrap address. A peer being down must not
// stop this node from starting, so a failure is logged and skipped.
func connectBootstrap(ctx context.Context, h host.Host, addrs []string) {
	for _, addr := range addrs {
		info, err := peer.AddrInfoFromString(addr)
		if err != nil {
			slog.Warn("bootstrap unusable", "addr", addr, "err", err)
			continue
		}

		if err := h.Connect(ctx, *info); err != nil {
			slog.Warn("bootstrap unreachable", "addr", addr, "err", err)
		}
	}
}
