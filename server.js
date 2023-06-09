require("dotenv").config();

// GraphQL tools
const { stitchSchemas } = require("@graphql-tools/stitch");

// Apollo tools
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const gql = require("graphql-tag");

// datasources
const { getContentfulSchema } = require("./utils/contenful/getContentfulSchema");
const { getAppSyncSchema } = require("./utils/appsync/getAppSyncSchema");

(async () => {
  /** Contentful pattern */
  const { schema } = await getContentfulSchema();
  const contentfulSchema = { schema: schema };

  // console.log("contentfulSchema", contentfulSchema)

  let appSyncSchema = getAppSyncSchema()
  const appSyncSubschema = { schema: appSyncSchema };

  // build the combined schema
  const gatewaySchema = stitchSchemas({
    subschemas: [contentfulSchema, appSyncSubschema],
  });

  await initApollo(gatewaySchema);
})();

async function initApollo(gatewaySchema) {
  const server = new ApolloServer({ schema: gatewaySchema });
  const { url } = await startStandaloneServer(server);
  console.log(`
        🚀  Server is running!
        📭  Query at ${url}
    `);
}
