# State stays on disk and is disposable: LocalStack forgets everything on
# restart, so delete terraform.tfstate and apply again.

module "cognito" {
  source = "../../modules/cognito"

  name                = "ecoa-local-users"
  deletion_protection = "INACTIVE"
}
