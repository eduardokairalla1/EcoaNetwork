# The pool every developer points at.

module "cognito" {
  source = "../../modules/cognito"

  name                = "ecoa-dev-users"
  deletion_protection = "ACTIVE"
}
