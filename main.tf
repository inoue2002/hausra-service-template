terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "hasura_admin_secret" {
  description = "Admin secret for Hasura"
  type        = string
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

# ... (既存の内容)

# Cloud Run service for NestJS using Cloud Run v2
resource "google_cloud_run_v2_service" "nestjs" {
  name     = "nestjs-service"
  location = var.region

  template {
    containers {
      image = var.nestjs_image
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [google_project_service.apis]
}

# IAM policy to make the NestJS service public
resource "google_cloud_run_service_iam_member" "nestjs_public" {
  service  = google_cloud_run_v2_service.nestjs.id
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
