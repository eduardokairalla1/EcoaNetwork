package p2p

import (
	"context"
	"testing"
	"time"

	"github.com/libp2p/go-libp2p"
)


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

