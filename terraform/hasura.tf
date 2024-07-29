resource "google_cloud_run_v2_service" "hasura" {
  name     = "hasura-service"
  location = var.region

  template {
    containers {
      image = var.hasura_image

      env {
        name  = "HASURA_GRAPHQL_DATABASE_URL"
        value = var.database_url
      }
      env {
        name  = "HASURA_GRAPHQL_ADMIN_SECRET"
        value = var.admin_secret
      }
      env {
        name  = "HASURA_GRAPHQL_ENABLE_CONSOLE"
        value = "true"
      }
      env {
        name  = "HASURA_GRAPHQL_DEV_MODE"
        value = "true"
      }
      env {
        name  = "HASURA_GRAPHQL_ENABLED_LOG_TYPES"
        value = "startup,http-log,webhook-log,websocket-log,query-log"
      }
      env {
        name  = "HASURA_GRAPHQL_USE_PREPARED_STATEMENTS"
        value = "false"
      }
      env {
        name  = "HASURA_GRAPHQL_PG_CONNECTIONS"
        value = "50"
      }
      env {
        name  = "HASURA_GRAPHQL_PG_TIMEOUT"
        value = "180"
      }
      env {
        name  = "HASURA_GRAPHQL_USE_PG_POOL_TIMEOUT"
        value = "180"
      }
      env {
        name  = "HASURA_GRAPHQL_CORS_DOMAIN"
        value = "*"
      }

      env {
        name  = "HASURA_GRAPHQL_JWT_SECRET"
        value = var.jwt_secret
      }
      
      ports {
        container_port = 8080
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

resource "google_cloud_run_service_iam_member" "hasura_public" {
  service  = google_cloud_run_v2_service.hasura.id
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}