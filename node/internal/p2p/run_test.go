package p2p

import (
	"context"
	"testing"
	"time"
)


// TestRunStopsWithContext pins the shutdown path: cancelling ctx has to end
// the loop, otherwise the goroutine outlives the node.
func TestRunStopsWithContext(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	p, err := New(ctx, Config{Network: "ecoa-test", Listen: loopback})
	if err != nil {
		t.Fatalf("New: %v", err)
	}
	defer p.Close()

	runCtx, stop := context.WithCancel(ctx)
	done := make(chan struct{})

	go func() {
		p.Run(runCtx)
		close(done)
	}()

	stop()

	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("Run did not return after its context was cancelled")
	}
}
