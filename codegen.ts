import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [process.env.NEXT_PUBLIC_ALGEBRA_SUBGRAPH!],
  documents: ["src/hooks/liquidity/swapr.graphql"],
  generates: {
    "./src/hooks/liquidity/gql/gql.ts": {
      plugins: ["typescript", "typescript-graphql-request"],
    },
  },
};

export default config;
