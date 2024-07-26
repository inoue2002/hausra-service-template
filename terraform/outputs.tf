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