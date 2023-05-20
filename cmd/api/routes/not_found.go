package routes

import (
	"fmt"
	"net/http"

	"finances/pkg/errors"
	"github.com/gin-gonic/gin"
)

func notFound(c *gin.Context) {
	c.Error(errors.New(errors.Input{
		Message:    fmt.Sprintf("Cannot %s %s", c.Request.Method, c.Request.URL.String()),
		StatusCode: http.StatusNotFound,
	}))
}
