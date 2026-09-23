package p2p

import "testing"


func TestTopic(t *testing.T) {
	cases := []struct {
		network string
		want    string
	}{
		{"ecoa", "/ecoa/events/1"},
		{"ecoa-dev", "/ecoa-dev/events/1"},
	}

	for _, c := range cases {
		if got := Topic(c.network); got != c.want {
			t.Errorf("Topic(%q) = %q, want %q", c.network, got, c.want)
		}
	}
}


// TestTopicIsPerNetwork guards the separation the protocol relies on: two
// networks must never share a topic.
func TestTopicIsPerNetwork(t *testing.T) {
	if Topic("ecoa") == Topic("ecoa-dev") {
		t.Fatal("different networks produced the same topic")
	}
}
