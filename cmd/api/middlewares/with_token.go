package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"finances/pkg/config"
	"finances/pkg/env"
	"finances/pkg/errors"
	"finances/pkg/token"
)

func WithToken(c *gin.Context) {
	headerToken := c.GetString(config.AuthHeaderToken)

	if headerToken == env.Required("JWT_PUBLIC_TOKEN") {
		c.Next()
		return
	}

	unauthorized := errors.New(errors.Input{
		Code:       "INVALID_JWT_TOKEN",
		Message:    "Missing token in request.",
		StatusCode: http.StatusUnauthorized,
	})

	if headerToken == "" {
		c.AbortWithError(unauthorized.StatusCode, unauthorized)
		return
	}

	if len(strings.Split(headerToken, ".")) != 3 {
		unauthorized.Message = "The token is badly formatted."
		c.AbortWithError(unauthorized.StatusCode, unauthorized)
		return
	}

	payload, err := token.NewJwt().Decode(headerToken)
	if err != nil {
		unauthorized.Message = "Your access token is not valid, please login again."
		unauthorized.OriginalError = err.Error()
		c.AbortWithError(unauthorized.StatusCode, unauthorized)
		return
	}

	c.Set(config.TokenPayloadCtxKey, payload)
	c.Next()
}
