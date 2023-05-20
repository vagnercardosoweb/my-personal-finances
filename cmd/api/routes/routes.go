package routes

import (
	auth_handlers "finances/internal/auth/handlers"
	"github.com/gin-gonic/gin"

	"finances/cmd/api/middlewares"
)

func Setup(router *gin.Engine) {
	router.NoRoute(notFound)
	router.NoMethod(notAllowed)

	router.GET("/", middlewares.NoCacheHandler, healthy)
	router.GET("/favicon.ico", favicon)

	authGroup := router.Group("/auth")
	authGroup.POST("/login", middlewares.WrapHandler(auth_handlers.Login))
}
