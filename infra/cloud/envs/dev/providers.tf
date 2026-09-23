terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "sa-east-1"

  # Refuse to run against any other account, e.g. when the wrong profile is
  # active.
  allowed_account_ids = [var.account_id]

  default_tags {
    tags = {
      Project     = "ecoa"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}
