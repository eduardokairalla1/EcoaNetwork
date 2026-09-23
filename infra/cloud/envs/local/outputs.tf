output "user_pool_id" {
  value = module.cognito.user_pool_id
}

output "client_id" {
  value = module.cognito.client_id
}

output "client_secret" {
  value     = module.cognito.client_secret
  sensitive = true
}

# LocalStack signs tokens under its own host, not cognito-idp.amazonaws.com,
# so the module's issuer doesn't match what shows up in `iss`.
locals {
  issuer = "http://localhost.localstack.cloud:4566/${module.cognito.user_pool_id}"
}

output "issuer" {
  value = local.issuer
}

output "jwks_uri" {
  value = "${local.issuer}/.well-known/jwks.json"
}
