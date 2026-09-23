package p2p

import (
	"context"
	"errors"
	"testing"
	"time"
)


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
