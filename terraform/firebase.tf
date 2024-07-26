# Firebase プロバイダーの設定
provider "google-beta" {
  project                 = var.project_id
  region                  = var.region
  user_project_override   = true
  billing_project         = var.project_id
}

# Firebaseサービスを有効化
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [google_project_service.apis]
}

# Identity Platform の設定を作成
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = var.project_id

  # 匿名ユーザーの自動削除を設定
  autodelete_anonymous_users = true

  # サインイン設定
  sign_in {
    allow_duplicate_emails = false

    anonymous {
      enabled = true
    }

    email {
      enabled           = true
      password_required = false
    }
  }

  depends_on = [google_project_service.apis]
}

# Firebase Web アプリの作成
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = var.project_id
  display_name = "My Web App"
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.default]
}

resource "null_resource" "deploy_nextjs" {
  depends_on = [
    google_firebase_web_app.default,
    local_file.firebaserc
  ]

  provisioner "local-exec" {
    command = <<-EOT
      # NextJSアプリケーションのビルド
      cd ${path.root}/../nextjs
      npm install
      npm run build

      # Firebase CLIを使用してデプロイ
      firebase use ${var.project_id} --add
      firebase deploy --only hosting
    EOT
  }

  # 再デプロイのトリガー
  triggers = {
    always_run = "${timestamp()}"
    firebaserc_content = local_file.firebaserc.content
  }
}

# .firebaserc ファイルの生成
resource "local_file" "firebaserc" {
  content = jsonencode({
    projects = {
      default = var.project_id
    }
  })
  filename = "${path.root}/../nextjs/.firebaserc"

  depends_on = [google_firebase_project.default]
}