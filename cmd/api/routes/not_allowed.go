package routes

import (
	"fmt"
	"net/http"

	"finances/pkg/errors"
	"github.com/gin-gonic/gin"
)

func notAllowed(c *gin.Context) {
	c.Error(errors.New(errors.Input{
		Message:    fmt.Sprintf("Not allowed %s %s", c.Request.Method, c.Request.URL.Path),
		StatusCode: http.StatusMethodNotAllowed,
	}))
}
