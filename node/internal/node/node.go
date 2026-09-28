// Package node decides what happens to each event the node receives.
package node


import (
	"context"
	"log/slog"

	"github.com/eduardokairalla1/EcoaNetwork/internal/p2p"
	"github.com/eduardokairalla1/EcoaNetwork/internal/store"
)


// --- GLOBALS ---

type Node struct {
	store *store.Store
	peer  *p2p.Peer
}


// --- CODE ---

func New(ctx context.Context, s *store.Store, cfg p2p.Config) (*Node, error) {
	p, err := p2p.New(ctx, cfg)
	if err != nil {
		return nil, err
	}

	return &Node{store: s, peer: p}, nil
}


// Run pulls events from the topic until ctx is cancelled.
func (n *Node) Run(ctx context.Context) {
	for {
		raw, err := n.peer.ReceiveEvent(ctx)
		if err != nil {
			return
		}

		slog.Info("received", "bytes", len(raw))
	}
}


// Publish waits for the mesh first, since Gossipsub drops unroutable messages.
func (n *Node) Publish(ctx context.Context, raw []byte) error {
	if err := n.peer.WaitForPeers(ctx); err != nil {
		return err
	}

	return n.peer.Publish(ctx, raw)
}


func (n *Node) Addrs() []string {
	return n.peer.Addrs()
}


func (n *Node) Close() error {
	return n.peer.Close()
}
