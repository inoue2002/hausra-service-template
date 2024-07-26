#!/bin/bash

# Dockerが起動しているか確認
if ! docker info > /dev/null 2>&1; then
  echo "Dockerが起動していません。Dockerを起動してください。Dockerがうまく起動していない場合はアクティビティモニターからDocker関連をすべて終了させましょう。"
  exit 1
fi

# terraform.tfvarsからproject_idを取得
project_id=$(grep 'project_id' terraform.tfvars | awk -F ' = ' '{print $2}' | tr -d '"')

# project_idを表示
echo "Project ID: ${project_id}"

# gcloudの認証情報を設定（まだログインしていない場合のみ）
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  gcloud auth application-default login
fi

# gcloudでproject_idをセット
gcloud config set project ${project_id}

# 乱数を生成
random_tag=$(openssl rand -hex 12)

# リポジトリ名を定義
reponame="my-docker-repo"

# デプロイするサービスを選択
echo "デプロイするサービスを選択してください:"
options=("nestjs" "hasura" "両方" "キャンセル")
select opt in "${options[@]}"
do
  case $opt in
    "nestjs")
      services=("nestjs")
      break
      ;;
    "hasura")
      services=("hasura")
      break
      ;;
    "両方")
      services=("nestjs" "hasura")
      break
      ;;
    "キャンセル")
      echo "デプロイがキャンセルされました。"
      exit 0
      ;;
    *)
      echo "無効な選択です。もう一度選択してください。"
      ;;
  esac
done

cd ..

# リポジトリが存在しない場合は作成
if ! gcloud artifacts repositories describe ${reponame} --location=asia-northeast1 > /dev/null 2>&1; then
  gcloud artifacts repositories create ${reponame} --repository-format=docker --location=asia-northeast1 --description="My Docker repository"
fi

# 選択されたサービスをビルドとプッシュ
for service in "${services[@]}"; do
  cd $service
  docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/${service}:${random_tag} .
  docker push asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/${service}:${random_tag}
  cd ..
done

cd terraform

# .tfvarsファイルを更新
for service in "${services[@]}"; do
  sed -i.bak "s|^${service}_image = \".*\"|${service}_image = \"asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/${service}:${random_tag}\"|" terraform.tfvars
done

# Terraformを実行
terraform init -reconfigure
terraform apply -auto-approve

# Cloud RunのURLを取得して表示
for service in "${services[@]}"; do
  service_url=$(gcloud run services describe ${service}-service --platform managed --region asia-northeast1 --format "value(status.url)")
  echo "${service}のデプロイURL: ${service_url}"
done