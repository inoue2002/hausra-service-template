#!/bin/bash

# terraform.tfvarsからproject_idを取得
project_id=$(grep 'project_id' terraform.tfvars | awk -F ' = ' '{print $2}' | tr -d '"')

# gcloudの認証情報を設定
gcloud auth application-default login

# gcloudでproject_idをセット
gcloud config set project ${project_id}

# 乱数を生成
random_tag=$(openssl rand -hex 12)

# リポジトリ名を定義
reponame="my-docker-repo"

cd ..

# NestJSのビルドとプッシュ
cd nestjs

# リポジトリが存在しない場合は作成
gcloud artifacts repositories create ${reponame} --repository-format=docker --location=asia-northeast1 --description="My Docker repository"

docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/nestjs:${random_tag} .
docker push asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/nestjs:${random_tag}
cd ..

# Hasuraのビルドとプッシュ
cd hasura
docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/hasura:${random_tag} .
docker push asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/hasura:${random_tag}

cd ../terraform

# .tfvarsファイルを更新
sed -i.bak "s|^nestjs_image = \".*\"|nestjs_image = \"asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/nestjs:${random_tag}\"|" terraform.tfvars
sed -i.bak "s|^hasura_image = \".*\"|hasura_image = \"asia-northeast1-docker.pkg.dev/${project_id}/${reponame}/hasura:${random_tag}\"|" terraform.tfvars

# Terraformを実行
terraform init
terraform apply -auto-approve