variable "name" {
  description = "User pool name, e.g. ecoa-dev-users."
  type        = string
}

variable "deletion_protection" {
  description = "Refuse to delete the pool while ACTIVE. Keep it on for any pool people rely on."
  type        = string
  default     = "ACTIVE"

  validation {
    condition     = contains(["ACTIVE", "INACTIVE"], var.deletion_protection)
    error_message = "deletion_protection must be ACTIVE or INACTIVE."
  }
}

variable "password_min_length" {
  description = "Shortest password accepted. Lowercase, uppercase, number and symbol are required on top of it."
  type        = number
  default     = 8
}

variable "access_token_validity_minutes" {
  description = "Lifetime of access and ID tokens."
  type        = number
  default     = 60
}

variable "refresh_token_validity_days" {
  description = "Lifetime of refresh tokens."
  type        = number
  default     = 30
}
