import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.CODEGEN_SCHEMA_URL ?? "http://localhost:3001/graphql",
  documents: ["src/graphql/operations/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    // Schema types only (User, Comment, Mutation, …)
    "src/graphql/generated/schema-types.ts": {
      plugins: ["typescript"],
      config: {
        useTypeImports: true,
      },
    },
    // Operation documents + operation-specific types (client-preset)
    "src/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
        importTypesFrom: "./schema-types",
      },
    },
    // Human-readable schema reference
    "src/graphql/generated/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
