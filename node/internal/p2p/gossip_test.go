package p2p

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/libp2p/go-libp2p"
)


func TestTopic(t *testing.T) {
	cases := []struct {
		network string
		want    string
	}{
		{"ecoa", "/ecoa/events/1"},
		{"ecoa-dev", "/ecoa-dev/events/1"},
	}

	for _, c := range cases {
		if got := Topic(c.network); got != c.want {
			t.Errorf("Topic(%q) = %q, want %q", c.network, got, c.want)
		}
	}
}


// TestTopicIsPerNetwork guards the separation the protocol relies on: two
// networks must never share a topic.
func TestTopicIsPerNetwork(t *testing.T) {
	if Topic("ecoa") == Topic("ecoa-dev") {
		t.Fatal("different networks produced the same topic")
	}
}


func TestJoinTopic(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	h, err := libp2p.New(libp2p.ListenAddrStrings(loopback))
	if err != nil {
		t.Fatalf("host: %v", err)
	}
	defer h.Close()

	topic, sub, err := joinTopic(ctx, h, "ecoa-test")
	if err != nil {
		t.Fatalf("joinTopic: %v", err)
	}
	defer sub.Cancel()

	if topic.String() != Topic("ecoa-test") {
		t.Errorf("joined %q, want %q", topic.String(), Topic("ecoa-test"))
	}
}


func TestReceiveEventStopsWithContext(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	defer p.Close()

	cancelled, stop := context.WithCancel(ctx)
	stop()

	if _, err := p.ReceiveEvent(cancelled); !errors.Is(err, context.Canceled) {
		t.Fatalf("ReceiveEvent = %v, want a cancellation error", err)
	}
}


// TestWaitForPeersGivesUpWithNoPeers pins the first exit: alone on the
// network there is nothing to wait for, so the caller's deadline must win
// instead of the call hanging forever.
func TestWaitForPeersGivesUpWithNoPeers(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	defer p.Close()

	short, stop := context.WithTimeout(ctx, 200*time.Millisecond)
	defer stop()

	if err := p.WaitForPeers(short); !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("WaitForPeers = %v, want a deadline error", err)
	}
}


// TestWaitForPeersGivesUpDuringHeartbeat pins the second exit: a peer is
// already there, so the wait is only for the mesh graft, and cancelling
// during it must still return rather than publish into a void.
func TestWaitForPeersGivesUpDuringHeartbeat(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	a, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("a: %v", err)
	}
	defer a.Close()

	b, err := New(ctx, Config{
		Network:        "ecoa-test",
		Listen:         loopback,
		BootstrapAddrs: a.Addrs(),
	})
	if err != nil {
		t.Fatalf("b: %v", err)
	}
	defer b.Close()

	deadline := time.Now().Add(10 * time.Second)
	for len(a.topic.ListPeers()) == 0 {
		if time.Now().After(deadline) {
			t.Fatal("b never subscribed to the topic")
		}

		time.Sleep(pollInterval)
	}

	cancelled, stop := context.WithCancel(ctx)
	stop()

	if err := a.WaitForPeers(cancelled); !errors.Is(err, context.Canceled) {
		t.Fatalf("WaitForPeers = %v, want a cancellation error", err)
	}
}
