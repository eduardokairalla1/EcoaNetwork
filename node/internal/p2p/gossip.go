package p2p


// --- CODE ---

// Topic returns the Gossipsub topic for a network: one topic per network,
// carrying every event type.
func Topic(network string) string {
	return "/" + network + "/events/1"
}
