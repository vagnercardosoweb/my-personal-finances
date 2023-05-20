package auth_handlers

import (
	repositories "finances/internal/auth/repositories"
	services "finances/internal/auth/services"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"

	"finances/pkg/config"
	"finances/pkg/password_hash"
	"finances/pkg/postgres"
	"finances/pkg/token"
)

type Input struct {
	Email    string
	Password string
}

func Login(c *gin.Context) any {
	var input Input
	if err := c.ShouldBindBodyWith(&input, binding.JSON); err != nil {
		return err
	}

	svc := services.New(
		repositories.NewPostgres(
			c.MustGet(config.PgConnectCtxKey).(*postgres.Connection),
			c.Request.Context(),
		),
		password_hash.NewBcrypt(),
		token.NewJwt(),
	)

	result, err := svc.Login(input.Email, input.Password)
	if err != nil {
		return err
	}

	return map[string]string{
		"token": result,
	}
}
