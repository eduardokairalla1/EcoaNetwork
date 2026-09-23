output "user_pool_id" {
  value = aws_cognito_user_pool.this.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.this.arn
}

output "issuer" {
  value = "https://${aws_cognito_user_pool.this.endpoint}"
}

output "jwks_uri" {
  value = "https://${aws_cognito_user_pool.this.endpoint}/.well-known/jwks.json"
}
