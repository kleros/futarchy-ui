import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: [process.env.NEXT_PUBLIC_ALGEBRA_SUBGRAPH!],
  documents: ["src/hooks/liquidity/swapr.graphql"],
  generates: {
    "./src/hooks/liquidity/gql/gql.ts": {
      // preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        strictScalars: true,
        scalars: {
          BigDecimal: "string",
          BigInt: "string",
          Int8: "string",
          Bytes: "`0x${string}`",
          Timestamp: "string",
        },
      },
    },
  },
};

export default config;
