package p2p

import (
	"bytes"
	"sync"
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
