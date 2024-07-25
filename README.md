# 最強の個人開発アーキテクチャ

このドキュメントでは、個人開発者が効率的かつ効果的にプロジェクトを進めるための最強のアーキテクチャを紹介します。

## 使用技術

- **Terraform**: インフラストラクチャをコードとして管理し、再現性のある環境を構築します。
- **Google Cloud Run**: スケーラブルなコンテナベースのアプリケーションをデプロイします。
- **Hasura**: 高速なGraphQL APIを提供し、データベースとのやり取りを簡素化します。

## 使い方

1. リポジトリをクローンします。
   ```sh
   git clone <リポジトリのURL>
   ```

2. Google Cloud プロジェクトを作成し、請求先アカウントを紐づけておきます。

3. Supabaseでデータベースを作成し、Postgres URLを取得しておきます。

4. `terraform/terraform.tfvars` の `projectId` を変更します。

5. データベースのURLを変更します。

6. `cd terraform` で `sh build.sh` を起動します。
   ```sh
   cd terraform
   sh build.sh
   ```
   → これで、nestjsとhasuraがCloud Runにデプロイされます。

## 現在できていること

- TerraformからGoogle Cloudへ、HasuraとNestJSのAPIのデプロイ
- デプロイしたHasura Consoleへのログイン

## これからやりたいこと

- HasuraとNestJSの接続（カスタムスキーマ的な？）
- HasuraからSupabaseへの接続（テーブル作成など）
- GraphQL Code Generatorを使用してクライアント用のコードを生成
- フロントエンドからHasuraへリクエストを行い、バックエンドの処理を実行
- ビジネスロジックをHasuraからNestJSへ流して処理
- Firebase AuthをTerraformで自動構築し、フロントエンドのためのログイン機構を提供
- Firebase AuthのJWTを使用してHasuraのロール管理を行う

## 削除する時

Terraform destroy
