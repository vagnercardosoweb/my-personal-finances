package middlewares

import (
	"finances/pkg/logger_new"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"finances/pkg/config"
)

func requestId(c *gin.Context) {
	requestId := c.GetHeader("x-amzn-trace-id")
	if requestId == "" {
		requestId = c.GetHeader("x-amzn-requestid")
	}
	if requestId == "" {
		requestId = uuid.New().String()
	}
	c.Set(config.RequestIdCtxKey, requestId)
	c.Set(config.LoggerCtxKey, logger_new.New().WithID(requestId))
	c.Header("X-Request-Id", requestId)
	c.Next()
}
