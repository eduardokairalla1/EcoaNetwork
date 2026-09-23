output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.this.arn
}

output "client_id" {
  value = aws_cognito_user_pool_client.backend.id
}

output "client_secret" {
  value     = aws_cognito_user_pool_client.backend.client_secret
  sensitive = true
}

output "issuer" {
  value = "https://${aws_cognito_user_pool.this.endpoint}"
}

output "jwks_uri" {
  value = "https://${aws_cognito_user_pool.this.endpoint}/.well-known/jwks.json"
}
