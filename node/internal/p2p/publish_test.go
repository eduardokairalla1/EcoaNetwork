package p2p

import (
	"context"
	"log/slog"
	"strings"
	"testing"
	"time"
)


// TestPublishReachesPeer is the one that matters: an event published on one
// node has to arrive on another over Gossipsub.
func TestPublishReachesPeer(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	sender, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("sender: %v", err)
	}
	defer sender.Close()

	receiver, err := New(ctx, Config{
		Network:        "ecoa-test",
		Listen:         loopback,
		BootstrapAddrs: sender.Addrs(),
	})
	if err != nil {
		t.Fatalf("receiver: %v", err)
	}
	defer receiver.Close()

	// One logger for the whole application, so the buffer is shared. Only
	// the receiver runs: a sender that also ran would satisfy the assertion
	// with its own echo of the publish.
	var seen safeBuffer
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&seen, nil)))
	defer slog.SetDefault(previous)

	go receiver.Run(ctx)

	if err := sender.WaitForPeers(ctx); err != nil {
		t.Fatalf("no peer subscribed to the topic: %v", err)
	}

	event := []byte(`{"eventType":"review.created"}`)
	if err := sender.Publish(ctx, event); err != nil {
		t.Fatalf("publish: %v", err)
	}

	want := "bytes=30"
	deadline := time.Now().Add(10 * time.Second)

	for time.Now().Before(deadline) {
		if strings.Contains(seen.String(), want) {
			return
		}

		time.Sleep(20 * time.Millisecond)
	}

	t.Fatalf("event never arrived; log was: %q", seen.String())
}
