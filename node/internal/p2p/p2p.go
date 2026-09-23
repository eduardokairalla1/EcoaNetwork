// Package p2p connects the node to its peers: a libp2p host and Gossipsub on
// the network's single topic.
package p2p



// --- CODE ---

// Topic returns the Gossipsub topic for a network: one topic per network,
// carrying every event type.
func Topic(network string) string {
	return "/" + network + "/events/1"
}
