FROM hasura/graphql-engine:latest

# 必要な環境変数を設定
ENV HASURA_GRAPHQL_ENABLE_CONSOLE=true
ENV HASURA_GRAPHQL_DEV_MODE=true
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES=startup,http-log,webhook-log,websocket-log,query-log
ENV HOSTNAME="0.0.0.0"
ENV HASURA_GRAPHQL_SERVER_PORT=8080

# 一生デプロイできなかったが、以下を追加したら動いた
ENV HASURA_GRAPHQL_USE_PREPARED_STATEMENTS=false
ENV HASURA_GRAPHQL_PG_CONNECTIONS=50
ENV HASURA_GRAPHQL_PG_TIMEOUT=180
ENV HASURA_GRAPHQL_USE_PG_POOL_TIMEOUT=180

ENV HASURA_GRAPHQL_CORS_DOMAIN="*"

# ポートの設定
EXPOSE 8080

# コマンドの設定
CMD ["graphql-engine", "serve", "--port", "8080"]