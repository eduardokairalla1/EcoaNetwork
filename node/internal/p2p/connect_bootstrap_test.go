package p2p

import (
	"context"
	"log/slog"
	"strings"
	"testing"
	"time"

	"github.com/libp2p/go-libp2p"
)


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
