package p2p

import (
	"context"
	"testing"
	"time"
)


func TestNew(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	defer p.Close()

	if p.topic.String() != Topic("ecoa-test") {
		t.Errorf("joined %q, want %q", p.topic, Topic("ecoa-test"))
	}
}


// TestNewRejectsBadListenAddr pins the first error path: a listen address the
// host cannot bind must surface, not start a half-built peer.
func TestNewRejectsBadListenAddr(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	_, err := New(ctx, Config{Network: "ecoa-test", Listen: "nonsense"})
	if err == nil {
		t.Fatal("an unbindable listen address should fail")
	}
}


// TestNewSurvivesDeadBootstrap checks that a bootstrap peer being down does
// not stop this node: the network may be empty and it still has to start.
func TestNewSurvivesDeadBootstrap(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{
		Network:        "ecoa-test",
		Listen:         loopback,
		BootstrapAddrs: []string{deadEnd},
	})
	if err != nil {
		t.Fatalf("New with a dead bootstrap peer: %v", err)
	}
	defer p.Close()
}
