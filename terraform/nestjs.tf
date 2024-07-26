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
