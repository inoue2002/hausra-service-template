# NestJS用の環境変数を定義
locals {
  nestjs_env_vars = {
    LINE_CLIENT_ID = var.line_client_id
    DATABASE_URL                    = var.database_url
    HASURA_GRAPHQL_ADMIN_SECRET     = var.admin_secret
    SERVICE_ACCOUNT_PROJECT_ID      = data.google_firebase_web_app_config.default.project
    SERVICE_ACCOUNT_CLIENT_EMAIL    = var.firebase_admin_service_account_email
    SERVICE_ACCOUNT_PRIVATE_KEY     = "${var.firebase_admin_service_account_key}"
  }
  
  nestjs_existing_content = fileexists("${path.module}/../nestjs/.env.local") ? file("${path.module}/../nestjs/.env.local") : ""
  nestjs_filtered_content = [for line in split("\n", local.nestjs_existing_content) : line if !contains(keys(local.nestjs_env_vars), split("=", line)[0])]
  nestjs_updated_content  = join("\n", concat(local.nestjs_filtered_content, [for key, value in local.nestjs_env_vars : "${key}=${value}"]))
}

# NestJS用の.env.localファイルを作成
resource "local_file" "nestjs_env_local" {
  content  = local.nestjs_updated_content
  filename = "${path.module}/../nestjs/.env.local"
}

# Cloud Run service for NestJS using Cloud Run v2
resource "google_cloud_run_v2_service" "nestjs" {
  name     = "nestjs-service"
  location = var.region

  template {
    containers {
      image = var.nestjs_image

      dynamic "env" {
        for_each = local.nestjs_env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
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
