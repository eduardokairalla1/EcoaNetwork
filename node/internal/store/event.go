package store


import (
	"errors"

	bolt "go.etcd.io/bbolt"
)


// ErrDuplicate is returned by AddEvent for an id already stored.
var ErrDuplicate = errors.New("store: event already stored")


// AddEvent stores raw, byte for byte, under id, never overwriting an id.
func (s *Store) AddEvent(id string, raw []byte) error {
	return s.db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(eventsBucket)

		if bucket.Get([]byte(id)) != nil {
			return ErrDuplicate
		}

		return bucket.Put([]byte(id), raw)
	})
}
