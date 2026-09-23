terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# LocalStack. Credentials are dummies; the endpoints are the only thing that
# makes this local.
provider "aws" {
  region     = "sa-east-1"
  access_key = "test"
  secret_key = "test"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    cognitoidp = "http://localhost:4566"
    iam        = "http://localhost:4566"
    sts        = "http://localhost:4566"
  }

  default_tags {
    tags = {
      Project     = "ecoa"
      Environment = "local"
      ManagedBy   = "terraform"
    }
  }
}
