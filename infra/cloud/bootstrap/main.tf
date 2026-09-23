# The S3 bucket that holds remote state. Applied once per AWS account, with
# local state, before any environment that uses the S3 backend.
#
# The code is the same for every account, so each account gets a workspace
# named after it (dev, prod) and its own state under terraform.tfstate.d/.

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
      Project   = "ecoa"
      ManagedBy = "terraform"
    }
  }
}

variable "account_id" {
  description = "AWS account this configuration may touch. Kept out of the repo in a per-account .tfvars file."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.account_id))
    error_message = "account_id must be a 12-digit AWS account ID."
  }
}

# Bucket names are global, so the account ID keeps this one ours.
resource "aws_s3_bucket" "state" {
  bucket = "ecoa-tfstate-${var.account_id}"

  lifecycle {
    prevent_destroy = true

    # The default workspace belongs to no account; applying there would mix
    # one account's bucket into another's state.
    precondition {
      condition     = terraform.workspace != "default"
      error_message = "Select the account's workspace first: terraform workspace select dev"
    }
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket = aws_s3_bucket.state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# State holds secrets in plain text; refuse any request that isn't over TLS.
resource "aws_s3_bucket_policy" "state" {
  bucket = aws_s3_bucket.state.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "DenyInsecureTransport"
      Effect    = "Deny"
      Principal = "*"
      Action    = "s3:*"
      Resource = [
        aws_s3_bucket.state.arn,
        "${aws_s3_bucket.state.arn}/*",
      ]
      Condition = {
        Bool = { "aws:SecureTransport" = "false" }
      }
    }]
  })

  # A bucket policy is rejected while the public access block is still being
  # applied, so let that settle first.
  depends_on = [aws_s3_bucket_public_access_block.state]
}

output "state_bucket" {
  value = aws_s3_bucket.state.bucket
}
