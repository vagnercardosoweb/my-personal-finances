package config

import (
	"os"
	"strconv"
	"time"

	"finances/pkg/env"
)

var (
	AppEnv = env.Get("APP_ENV", "local")

	Pid         = os.Getpid()
	Hostname, _ = os.Hostname()

	IsLocal      = AppEnv == "local"
	IsStaging    = AppEnv == "staging"
	IsProduction = AppEnv == "production"
)

const (
	PgConnectCtxKey    = "PgConnectCtxKey"
	RedisConnectCtxKey = "RedisConnectCtxKey"
	AuthHeaderToken    = "AuthHeaderTokenCtxKey"
	TokenPayloadCtxKey = "TokenPayloadCtxKey"
	RequestIdCtxKey    = "RequestIdCtxKey"
	LoggerCtxKey       = "LoggerCtxKey"
)

func GetShutdownTimeout() time.Duration {
	timeout, err := strconv.Atoi(env.Get("SHUTDOWN_TIMEOUT", "0"))
	if err != nil {
		return 0
	}
	return time.Duration(timeout)
}
