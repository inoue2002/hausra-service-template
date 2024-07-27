variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "asia-northeast1"
}

variable "nestjs_image" {
  description = "The Docker image for NestJS"
  type        = string
}

variable "hasura_image" {
  type        = string
  description = "HasuraのDockerイメージ"
}

variable "database_url" {
  type        = string
  description = "データベースのURL"
}

variable "admin_secret" {
  type        = string
  description = "Hasura管理者シークレット"
}

variable "jwt_secret" {
  type        = string
  description = "JWTシークレット"
}

variable "liff_id" {
  type        = string
  description = "LIFF ID"
}