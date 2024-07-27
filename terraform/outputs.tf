output "database_url" {
  value       = var.database_url
  description = "データベースのURL"
}

data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.default.app_id
  project    = google_firebase_project.default.project
}

output "firebase_project_id" {
  value = data.google_firebase_web_app_config.default.project
}

output "firebase_web_app_api_key" {
  value = data.google_firebase_web_app_config.default.api_key
}

output "firebase_web_app_auth_domain" {
  value = data.google_firebase_web_app_config.default.auth_domain
}

output "firebase_web_app_id" {
  value = data.google_firebase_web_app_config.default.web_app_id
}

output "firebase_web_app_messaging_sender_id" {
  value = data.google_firebase_web_app_config.default.messaging_sender_id
}

output "firebase_web_app_storage_bucket" {
  value = data.google_firebase_web_app_config.default.storage_bucket
}


locals {
  env_vars = {
    HASURA_ADMIN_SECRET = var.admin_secret
    LIFF_ID             = var.liff_id
  }

  existing_content = fileexists("${path.module}/../nextjs/.env.local") ? file("${path.module}/../nextjs/.env.local") : ""
  filtered_content = [for line in split("\n", local.existing_content) : line if !contains(keys(local.env_vars), split("=", line)[0])]
  updated_content  = join("\n", concat(local.filtered_content, [for key, value in local.env_vars : "${key}=${value}"]))
}

resource "local_file" "env_local" {
  content = <<EOT
${local.updated_content}
EOT
  filename = "${path.module}/../nextjs/.env.local"
}