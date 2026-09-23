package p2p

import (
	"bytes"
	"context"
	"log/slog"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/libp2p/go-libp2p"
)


// --- GLOBALS ---

// loopback lets the kernel pick a free port, so tests never collide.
const loopback = "/ip4/127.0.0.1/tcp/0"


// deadEnd is a well-formed multiaddr nothing listens on: parsing succeeds and
// dialing fails, which is the path a bootstrap peer being down takes.
const deadEnd = "/ip4/127.0.0.1/tcp/1/p2p/" +
	"12D3KooWL8WucnuP3YZ7yh2E8bNggmBsqhGs4PxXrxTZaEF7DH1j"


// safeBuffer collects log output written from another goroutine.
type safeBuffer struct {
	mu  sync.Mutex
	buf bytes.Buffer
}


// --- CODE ---

func (b *safeBuffer) Write(p []byte) (int, error) {
	b.mu.Lock()
	defer b.mu.Unlock()

	return b.buf.Write(p)
}


func (b *safeBuffer) String() string {
	b.mu.Lock()
	defer b.mu.Unlock()

	return b.buf.String()
}


// TestConnectBootstrapSkipsUnusable covers both ways an entry can fail: one
// that does not parse and one that parses but refuses the dial. Neither may
// stop the caller, so the function returns nothing to check and the log is
// the evidence.
func TestConnectBootstrapSkipsUnusable(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	h, err := libp2p.New(libp2p.ListenAddrStrings(loopback))
	if err != nil {
		t.Fatalf("host: %v", err)
	}
	defer h.Close()

	var seen safeBuffer
	previous := slog.Default()
	slog.SetDefault(slog.New(slog.NewTextHandler(&seen, nil)))
	defer slog.SetDefault(previous)

	connectBootstrap(ctx, h, []string{"not-a-multiaddr", deadEnd})

	logged := seen.String()
	if !strings.Contains(logged, "bootstrap unusable") {
		t.Errorf("an unparseable addr was not reported: %q", logged)
	}

	if !strings.Contains(logged, "bootstrap unreachable") {
		t.Errorf("an undialable addr was not reported: %q", logged)
	}
}
