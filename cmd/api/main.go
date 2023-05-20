package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"finances/cmd/api/middlewares"
	"finances/cmd/api/routes"
	"finances/pkg/config"
	"finances/pkg/env"
	"finances/pkg/logger"
	"finances/pkg/monitoring"
	"finances/pkg/postgres"
	"finances/pkg/redis"
)

var (
	ctx          context.Context
	httpServer   *http.Server
	postgresConn *postgres.Connection
	redisConn    *redis.Connection
)

func init() {
	env.LoadFromLocal()
	ctx = context.Background()

	postgresConn = postgres.Connect(ctx, postgres.Default)
	ctx = context.WithValue(ctx, config.PgConnectCtxKey, postgresConn)

	redisConn = redis.Connect(ctx)
	ctx = context.WithValue(ctx, config.RedisConnectCtxKey, redisConn)

	httpServer = &http.Server{
		Addr:    fmt.Sprintf(":%s", env.Get("PORT", "3333")),
		Handler: handler(),
	}
}

func shutdown() {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit

	logger.Error("Shutting down server")

	timeout := config.GetShutdownTimeout() * time.Second
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown: %v", err.Error())
		os.Exit(1)
	}

	<-ctx.Done()

	logger.Error("Server exiting of %v seconds.", timeout)
}

func handler() *gin.Engine {
	if config.IsProduction {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.RemoveExtraSlash = true
	router.RedirectTrailingSlash = true

	router.Use(func(c *gin.Context) {
		c.Request = c.Request.WithContext(ctx)

		c.Set(config.PgConnectCtxKey, postgresConn)
		c.Set(config.RedisConnectCtxKey, redisConn)

		c.Next()
	})

	middlewares.Setup(router)
	routes.Setup(router)

	return router
}

func main() {
	defer redisConn.Close()
	defer postgresConn.Close()

	go func() {
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Server listen error: %v", err.Error())
			os.Exit(1)
		}
	}()

	logger.Info(
		"Server running on http://0.0.0.0:%s",
		env.Get("LOCAL_PORT", "3301"),
	)

	monitoring.RunProfiler()
	shutdown()
}
