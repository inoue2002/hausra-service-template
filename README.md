# 個人開発アーキテクチャ(仮)

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="ja" dir="ltr">期末試験の合間に思いつきでアプリを作ってたらこんな構成になった… <a href="https://t.co/Gjsdja1yBS">pic.twitter.com/Gjsdja1yBS</a></p>&mdash; ようかん / Yosuke Inoue (@inoue2002) <a href="https://twitter.com/inoue2002/status/1817953006056571201?ref_src=twsrc%5Etfw">July 29, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# 構成図

[![Image from Gyazo](https://i.gyazo.com/8cb1f626fa527ac2556b58a6d4e4ec97.png)](https://gyazo.com/8cb1f626fa527ac2556b58a6d4e4ec97)

## 使用技術

- **Terraform**: インフラストラクチャをコードとして管理し、再現性のある環境を構築します。
- **Google Cloud Run**: スケーラブルなコンテナベースのアプリケーションをデプロイします。
- **Hasura**: 高速なGraphQL APIを提供し、データベースとのやり取りを簡素化します。
- **Supabase**: ポスグレSQLデータベースを提供し、Hasuraと連携します。
- **Firebase Auth**: 認証機能を提供し、Hasuraと連携します。

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
- Next.jsを作成し、Firebase Hostingでデプロイ、Firebase Authの有効化
- GraphQL Code Generatorを使用してクライアント用のコードを生成
- HasuraとNestJSの接続（Hasura Actionを使用）
- HasuraからSupabaseへの接続（テーブル作成などはHasura管理画面から）
- フロントエンドからHasuraへリクエストを行い、バックエンドの処理を実行（ローカルで行う場合はngrokなどを使ってトンネリング）
- ビジネスロジックをHasuraからNestJSへ流して処理
- Firebase AuthをTerraformで自動構築し、フロントエンドのためのログイン機構を提供
- Firebase AuthのJWTを使用してHasuraのロール管理を行う
- NestjsでLIFFの認証を行う

## これからやりたいこと
- データマイグレーションツール（サンプルアプリが動くまで）
- HasuraのActionの定義もコードベースで実装する


## 削除する時

`cd terraform && terraform destroy`

## 覚書メモ

- HasuraからCodeGenできるのでそれを使う + Front用のコードとバックエンド用のコードを分ける必要あり。
  - 参考: https://hasura.io/learn/graphql/typescript-react-apollo/codegen/
- Firebase SQL を Data connectを使ってやること（ただし、現在はプレビューのため一旦廃止）
- HasuraはGraphQLサーバー。ポスグレを立ち上げて、そのフロントとしてHasuraサーバーを立てる。
  - HasuraCloudというSaaSもあるが、セルフホストを考える。CloudRunで構築。
- 複雑な処理はNestJSで構築する。
- Firebase AuthのJWTを使ってHasuraの認証を通す。
  - 参考: https://zenn.dev/glassmonkey/articles/55733b75c08e6a
  - 公式: https://hasura.io/learn/graphql/hasura-authentication/integrations/firebase/
- AppleSiliconでCloudRunを使用する際のBuild時のパラメータ
  - 参考: https://zenn.dev/msksgm/scraps/d667e2b2eecf4e
- 基本的にHasuraの管理画面からテーブル作成やパーミッション設定を行う。
