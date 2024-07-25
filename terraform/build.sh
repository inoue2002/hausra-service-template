#!/bin/bash

# terraform.tfvarsからproject_idを取得
project_id=$(grep 'project_id' terraform.tfvars | awk -F ' = ' '{print $2}' | tr -d '"')

# 乱数を生成
random_tag=$(openssl rand -hex 12)

cd ..

# NestJSのビルドとプッシュ
# cd nestjs
# docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag} .
# docker push asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag}
# cd ..

# Hasuraのビルドとプッシュ
cd hasura
docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/hasura:${random_tag} .
docker push asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/hasura:${random_tag}

cd ../terraform

# .tfvarsファイルを更新
# sed -i.bak "s|^nestjs_image = \".*\"|nestjs_image = \"asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag}\"|" terraform.tfvars
sed -i.bak "s|^hasura_image = \".*\"|hasura_image = \"asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/hasura:${random_tag}\"|" terraform.tfvars

# Terraformを実行
terraform init
terraform apply -auto-approve