package p2p

import (
	"context"
	"strings"
	"testing"
	"time"
)


// TestAddrs checks the round trip the comment promises: what a node reports
// has to be usable as another node's bootstrap entry, which means carrying
// the peer ID and not just the transport address.
func TestAddrs(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	defer p.Close()

	addrs := p.Addrs()
	if len(addrs) == 0 {
		t.Fatal("a listening node reported no addresses")
	}

	for _, addr := range addrs {
		if !strings.Contains(addr, "/p2p/") {
			t.Errorf("addr %q carries no peer ID", addr)
		}
	}
}
