package p2p


import (
	"context"

	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/libp2p/go-libp2p/core/host"
)


// --- CODE ---

// Topic returns the Gossipsub topic for a network: one topic per network,
// carrying every event type.
func Topic(network string) string {
	return "/" + network + "/events/1"
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


// ReceiveEvent blocks until an event arrives on the topic or ctx is cancelled.
func (p *Peer) ReceiveEvent(ctx context.Context) ([]byte, error) {
	msg, err := p.sub.Next(ctx)
	if err != nil {
		return nil, err
	}

	return msg.Data, nil
}
