// See https://oauth2-server.readthedocs.io/en/latest/model/spec.html for what you can do with this
const crypto = require("crypto");
const db = {
  // Here is a fast overview of what your db model should look like
  authorizationCode: {
    authorizationCode: "", // A string that contains the code
    expiresAt: new Date(), // A date when the code expires
    redirectUri: "", // A string of where to redirect to with this code
    client: null, // See the client section
    user: null, // Whatever you want... This is where you can be flexible with the protocol
  },
  client: {
    // Application wanting to authenticate with this server
    clientId: "myClientId", // Unique string representing the client
    clientSecret: "myClientSecret", // Secret of the client; Can be null
    grants: [], // Array of grants that the client can use (ie, `authorization_code`)
    redirectUris: [], // Array of urls the client is allowed to redirect to
  },
  token: {
    accessToken: "", // Access token that the server created
    accessTokenExpiresAt: new Date(), // Date the token expires
    client: null, // Client associated with this token
    user: null, // User associated with this token
  },
};

//const DebugControl = require("../utilities/debug.js");

module.exports = {
  getClient: async function (clientId, clientSecret) {
    let client = await strapi.entityService.findMany(
      "plugin::simple-auth.client-credential"
    );

    if (client.length) {
      client = client[0];
      return {
        clientId: client.client_id,
        clientSecret: client.client_secret,
        grants: client.grants,
        redirectUris: client.redirectUris,
      };
    } else return null;
  },
  generateAccessToken: (client, user, scope) => {},
  saveToken: async (token, client, user) => {
    let tokenStore = await strapi.entityService.create(
      "plugin::simple-auth.token-store",
      {
        data: {
          access_token: token.accessToken,
          access_token_expires_at: token.accessTokenExpiresAt,
          refresh_token: token.refreshToken, // NOTE this is only needed if you need refresh tokens down the line
          refresh_token_expires_at: token.refreshTokenExpiresAt,
          client: client,
          user: user,
        },
      }
    );

    return {
      accessToken: tokenStore.access_token,
      accessTokenExpiresAt: new Date(tokenStore.access_token_expires_at),
      refreshToken: tokenStore.refresh_token, // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: tokenStore.refresh_token_expires_at
        ? new Date(tokenStore.refresh_token_expires_at)
        : null,
      client: tokenStore.client,
      user: tokenStore.user,
    };
  },
  getAccessToken: async (token) => {
    /* This is where you select the token from the database where the code matches */
    // log({
    //   title: "Get Access Token",
    //   parameters: [{ name: "token", value: token }],
    // });
    // if (!token || token === "undefined") return false;
    // return new Promise((resolve) => resolve(db.token));

    let tokenStore = await strapi.entityService.findMany(
      "plugin::simple-auth.token-store",
      {
        filters: {
          access_token: {
            $in: [token],
          },
        },
      }
    );
    tokenStore = tokenStore[0];

    return {
      accessToken: tokenStore.access_token, // Access token that the server created
      accessTokenExpiresAt: new Date(tokenStore.access_token_expires_at), // Date the token expires
      client: tokenStore.client, // Client associated with this token
      user: tokenStore.user, // User associated with this token
    };
  },
  getRefreshToken: async (token) => {
    /* Retrieves the token from the database */
    // log({
    //   title: "Get Refresh Token",
    //   parameters: [{ name: "token", value: token }],
    // });
    // DebugControl.log.variable({ name: "db.token", value: db.token });
    let client = await strapi.entityService.findMany(
      "plugin::simple-auth.client-credential"
    );
    client = client[0];

    let tokenStore = await strapi.entityService.findMany(
      "plugin::simple-auth.token-store",
      {
        filters: {
          access_token: {
            $in: [token],
          },
        },
      }
    );
    tokenStore = tokenStore[0];

    // var ttt = {
    //   accessToken: "63411d23c2dbb287e97ac498cc8e819f1cd38be6",
    //   accessTokenExpiresAt: new Date("2023-11-25T01:24:21.953Z"),
    //   refreshToken: "56c9cb54087031137c1006bc0070af186daf64f5",
    //   refreshTokenExpiresAt: new Date("2023-11-25T01:24:21.953Z"),
    //   // refreshToken: "",
    //   // refreshTokenExpiresAt: null,
    //   client: {
    //     clientId: "myClientId",
    //     clientSecret: "myClientSecret",
    //     grants: ["authorization_code", "refresh_token", "client_credentials"],
    //     redirectUris: ["http://localhost:3030/client/app"],
    //   },
    //   user: { username: "username" },
    // };

    // return ttt;
    //return JSON.parse(ttt);
    return {
      accessToken: tokenStore.access_token, // Access token that the server created
      accessTokenExpiresAt: new Date(tokenStore.access_token_expires_at), // Date the token expires
      refreshToken: "", // NOTE this is only needed if you need refresh tokens down the line
      refreshTokenExpiresAt: null,
      // client: {
      //   clientId: tokenStore.client.client_id,
      //   clientSecret: tokenStore.client.client_secret,
      //   grants: tokenStore.client.grants,
      //   redirectUris: tokenStore.client.redirectUris,
      // }, // Client associated with this token
      client: tokenStore.client,
      user: tokenStore.user, // User associated with this token
    };
  },
  revokeToken: (token) => {
    /* Delete the token from the database */
    // log({
    //   title: "Revoke Token",
    //   parameters: [{ name: "token", value: token }],
    // });
    if (!token || token === "undefined") return false;
    return new Promise((resolve) => resolve(true));
  },
  generateAuthorizationCode: (client, user, scope) => {
    /* 
    For this to work, you are going have to hack this a little bit:
    1. navigate to the node_modules folder
    2. find the oauth_server folder. (node_modules/express-oauth-server/node_modules/oauth2-server)
    3. open lib/handlers/authorize-handler.js
    4. Make the following change (around line 136):

    AuthorizeHandler.prototype.generateAuthorizationCode = function (client, user, scope) {
      if (this.model.generateAuthorizationCode) {
        // Replace this
        //return promisify(this.model.generateAuthorizationCode).call(this.model, client, user, scope);
        // With this
        return this.model.generateAuthorizationCode(client, user, scope)
      }
      return tokenUtil.generateRandomToken();
    };
    */

    // log({
    //   title: "Generate Authorization Code",
    //   parameters: [
    //     { name: "client", value: client },
    //     { name: "user", value: user },
    //   ],
    // });

    const seed = crypto.randomBytes(256);
    const code = crypto.createHash("sha1").update(seed).digest("hex");
    return code;
  },
  saveAuthorizationCode: (code, client, user) => {
    /* This is where you store the access code data into the database */
    // log({
    //   title: "Save Authorization Code",
    //   parameters: [
    //     { name: "code", value: code },
    //     { name: "client", value: client },
    //     { name: "user", value: user },
    //   ],
    // });
    db.authorizationCode = {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      client: client,
      user: user,
    };
    return new Promise((resolve) =>
      resolve(
        Object.assign(
          {
            redirectUri: `${code.redirectUri}`,
          },
          db.authorizationCode
        )
      )
    );
  },
  getAuthorizationCode: (authorizationCode) => {
    /* this is where we fetch the stored data from the code */
    // log({
    //   title: "Get Authorization code",
    //   parameters: [{ name: "authorizationCode", value: authorizationCode }],
    // });
    return new Promise((resolve) => {
      resolve(db.authorizationCode);
    });
  },
  revokeAuthorizationCode: (authorizationCode) => {
    /* This is where we delete codes */
    // log({
    //   title: "Revoke Authorization Code",
    //   parameters: [{ name: "authorizationCode", value: authorizationCode }],
    // });
    db.authorizationCode = {
      // DB Delete in this in memory example :)
      authorizationCode: "", // A string that contains the code
      expiresAt: new Date(), // A date when the code expires
      redirectUri: "", // A string of where to redirect to with this code
      client: null, // See the client section
      user: null, // Whatever you want... This is where you can be flexible with the protocol
    };
    const codeWasFoundAndDeleted = true; // Return true if code found and deleted, false otherwise
    return new Promise((resolve) => resolve(codeWasFoundAndDeleted));
  },
  verifyScope: (token, scope) => {
    /* This is where we check to make sure the client has access to this scope */
    // log({
    //   title: "Verify Scope",
    //   parameters: [
    //     { name: "token", value: token },
    //     { name: "scope", value: scope },
    //   ],
    // });
    const userHasAccess = true; // return true if this user / client combo has access to this resource
    return new Promise((resolve) => resolve(userHasAccess));
  },

  getUserFromClient: () => {
    return new Promise((resolve) => resolve({ username: "username" }));
  },
};

function log({ title, parameters }) {
  // DebugControl.log.functionName(title);
  // DebugControl.log.parameters(parameters);
  console.log("title : ", title);
  console.log("parameters : ", parameters);
}
