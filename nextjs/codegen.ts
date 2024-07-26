import type { CodegenConfig } from '@graphql-codegen/cli';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

// .env.local ファイルを読み込む
dotenvConfig({ path: path.resolve(__dirname, '.env.local') });

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [process.env.HASURA_ENDPOINT || '']: {
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET || '',
        },
      },
    },
  ],
  documents: "src/**/*.graphql",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: true,
      },
    },
  },
};

export default config;