package redis

import (
	"fmt"
	"strconv"

	"finances/pkg/env"
	libRedis "github.com/go-redis/redis/v9"
)

func newConfig() *libRedis.Options {
	addr := fmt.Sprintf(
		"%s:%s",
		env.Required("REDIS_HOST"),
		env.Required("REDIS_PORT"),
	)

	database, _ := strconv.Atoi(env.Required("REDIS_DATABASE"))
	password := env.Required("REDIS_PASSWORD")

	return &libRedis.Options{
		Addr:     addr,
		Password: password,
		DB:       database,
	}
}
