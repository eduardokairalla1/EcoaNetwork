package p2p

import (
	"context"
	"testing"
	"time"
)


// TestClose checks that shutting down releases the port, which is what lets
// a node be restarted on the same address.
func TestClose(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}

	if err := p.Close(); err != nil {
		t.Fatalf("Close: %v", err)
	}

	if len(p.host.Addrs()) != 0 {
		t.Error("a closed node is still listening")
	}
}
