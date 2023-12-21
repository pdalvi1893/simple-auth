//const OAuthServer = require("express-oauth-server");
// const model = require("./model");

// module.exports = new OAuthServer({
//   model: model,
//   grants: ["authorization_code", "refresh_token", "client_credentials"],
//   accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
//   allowEmptyState: true,
//   allowExtendedTokenAttributes: true,
//   alwaysIssueNewRefreshToken: true,
//   refreshTokenLifetime: 60 * 60 * 24,
// });

const OAuth2Server = require("oauth2-server");
const model = require("./model");

module.exports = new OAuth2Server({
  model: model,
  accessTokenLifetime: 60 * 60 * 24 * 15,
  grants: ["authorization_code", "refresh_token", "client_credentials"],
  refreshTokenLifetime: 60 * 60 * 24 * 15,
  alwaysIssueNewRefreshToken: true,
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});
