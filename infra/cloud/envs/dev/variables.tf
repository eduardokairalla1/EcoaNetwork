variable "account_id" {
  description = "AWS account this configuration may touch. Kept out of the repo in terraform.tfvars."
  type        = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.account_id))
    error_message = "account_id must be a 12-digit AWS account ID."
  }
}
