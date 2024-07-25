#!/bin/bash

# terraform.tfvarsからproject_idを取得
project_id=$(grep 'project_id' terraform.tfvars | awk -F ' = ' '{print $2}' | tr -d '"')

# 乱数を生成
random_tag=$(openssl rand -hex 12)

cd nestjs

# イメージをビルドしてプッシュ
# Apple silicon Macの場合は--platform linux/amd64を指定
# https://zenn.dev/msksgm/scraps/d667e2b2eecf4e
docker build --platform linux/amd64 -t asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag} .
docker push asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag}

cd ..

# .tfvarsファイルを更新
sed -i.bak "s|^nestjs_image = \".*\"|nestjs_image = \"asia-northeast1-docker.pkg.dev/${project_id}/my-docker-repo/nestjs:${random_tag}\"|" terraform.tfvars

# Terraformを実行
terraform init
terraform apply -auto-approve