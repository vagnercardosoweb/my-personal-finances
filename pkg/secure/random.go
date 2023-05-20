package secure

import (
	"crypto/rand"
	"encoding/base64"
	"math/big"
)

// RandomGenerator produces cryptographically secure random data
type RandomGenerator struct{}

// RandomBytes returns securely generated random bytes. It will return
// an error if the system's secure random number generator fails to
// function correctly, in which case the caller should not continue.
// Taken from https://stackoverflow.com/questions/35781197/generating-a-random-fixed-length-byte-array-in-go
func (g RandomGenerator) RandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	// Note that err == nil only if we read len(b) bytes.
	if err != nil {
		return nil, err
	}
	return b, nil
}

// RandomString returns a URL-safe, base64 encoded, securely generated, random string.
// It will return an error if the system's secure random number generator fails to
// function correctly, in which case the caller should not continue. This should be
// used when there are concerns about security and need something cryptographically
// secure.
func (g RandomGenerator) RandomString(n int) (string, error) {
	b, err := g.RandomBytes(n)
	return base64.URLEncoding.EncodeToString(b), err
}

// RandomInt generates a random integer between min and max
func (g RandomGenerator) RandomInt(min, max int64) (int64, error) {
	bg := big.NewInt(max - min + 1)
	n, err := rand.Int(rand.Reader, bg)
	return n.Int64() + min, err
}
