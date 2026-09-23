// Package p2p connects the node to its peers: a libp2p host and Gossipsub on
// the network's single topic.
package p2p


import (
	"context"
	"log/slog"
	"time"

	"github.com/libp2p/go-libp2p"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/peer"
)


// --- GLOBALS ---

// pollInterval is how often WaitForPeers rechecks the topic.
const pollInterval = 50 * time.Millisecond


// DefaultBootstrapAddrs is the bootstrap list shipped with the node. Empty
// until a public node exists; the operator overrides it from configuration.
var DefaultBootstrapAddrs []string


// Config is what the node needs to join the network.
type Config struct {
	// Network is the network name, such as "ecoa-dev". It names the topic.
	Network string

	// Listen is the multiaddr this node listens on.
	Listen string

	// BootstrapAddrs is the list of peer multiaddrs to connect to on startup.
	BootstrapAddrs []string
}


// Peer is this node's presence on the network.
type Peer struct {
	host  host.Host
	topic *pubsub.Topic
	sub   *pubsub.Subscription
}

// --- CODE ---

// Topic returns the Gossipsub topic for a network: one topic per network,
// carrying every event type.
func Topic(network string) string {
	return "/" + network + "/events/1"
}


// New builds the peer: host, bootstrap connections, Gossipsub and the
// subscription. It does not start receiving events; call Run for that.
func New(ctx context.Context, cfg Config) (*Peer, error) {
	h, err := libp2p.New(libp2p.ListenAddrStrings(cfg.Listen))
	if err != nil {
		return nil, err
	}

	connectBootstrap(ctx, h, cfg.BootstrapAddrs)

	topic, sub, err := joinTopic(ctx, h, cfg.Network)
	if err != nil {
		return nil, err
	}

	return &Peer{host: h, topic: topic, sub: sub}, nil
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


// joinTopic starts Gossipsub and subscribes to the network's topic.
func joinTopic(
	ctx context.Context,
	h host.Host,
	network string,
) (*pubsub.Topic, *pubsub.Subscription, error) {
	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		return nil, nil, err
	}

	name := Topic(network)

	topic, err := ps.Join(name)
	if err != nil {
		return nil, nil, err
	}

	sub, err := topic.Subscribe()
	if err != nil {
		return nil, nil, err
	}

	return topic, sub, nil
}


// Run receives events until ctx is cancelled. It blocks, so a caller wanting
// it in the background starts it with go.
func (p *Peer) Run(ctx context.Context) {
	for {
		msg, err := p.sub.Next(ctx)
		if err != nil {
			return
		}

		slog.Info("accepted",
				   "bytes", len(msg.Data),
				   "from", msg.ReceivedFrom)
	}
}


// Addrs returns this node's full multiaddrs, ready to be used as another
// node's bootstrap entries.
func (p *Peer) Addrs() []string {
	var addrs []string
	for _, a := range p.host.Addrs() {
		addrs = append(addrs, a.String()+"/p2p/"+p.host.ID().String())
	}
	return addrs
}


// WaitForPeers blocks until the topic is ready to carry a publish, or ctx is
// cancelled. Gossipsub drops a message with no route instead of queueing it.
//
// A peer appears in ListPeers as soon as its subscription arrives, but it only
// starts relaying once the mesh is grafted, which happens on the next
// heartbeat. Publishing in between is silently lost, so waiting for a peer is
// necessary and not sufficient: one heartbeat has to pass as well.
func (p *Peer) WaitForPeers(ctx context.Context) error {
	for len(p.topic.ListPeers()) == 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(pollInterval):
		}
	}

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-time.After(pubsub.GossipSubHeartbeatInterval):
		return nil
	}
}


// Close shuts down the host.
func (p *Peer) Close() error {
	return p.host.Close()
}
