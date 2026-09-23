# The bucket comes from infra/bootstrap and is passed at init:
#   terraform init -backend-config="bucket=<state_bucket>"
terraform {
  backend "s3" {
    key          = "envs/dev/terraform.tfstate"
    region       = "sa-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
