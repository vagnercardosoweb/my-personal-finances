package middlewares

import (
	"net/http"

	"finances/pkg/errors"
	"github.com/gin-gonic/gin"
)

func panicAlert(c *gin.Context, err any) {
	message := err

	if e, ok := message.(error); ok {
		message = e.Error()
	}

	c.Error(errors.New(errors.Input{
		Code:          "PANIC_ERROR",
		Message:       "The application received a panic error",
		SendToSlack:   true,
		StatusCode:    http.StatusInternalServerError,
		OriginalError: message,
	}))

	responseError(c)
}
