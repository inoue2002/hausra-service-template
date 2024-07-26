terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "enable_apis" {
  description = "List of APIs to enable"
  type        = list(string)
}

# Enable necessary APIs
resource "google_project_service" "apis" {
  for_each = toset(var.enable_apis)
  project = var.project_id
  service = each.key

  disable_on_destroy = false
}

