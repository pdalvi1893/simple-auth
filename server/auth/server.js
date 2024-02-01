const OAuth2Server = require("oauth2-server");
const model = require("./model");

module.exports = new OAuth2Server({
  model: model,
  accessTokenLifetime: strapi.config.get('constants.ACCESS_TOKEN_LIFETIME') || 60 * 60 * 24 * 15,
  grants: ["authorization_code", "refresh_token", "client_credentials"],
  refreshTokenLifetime: strapi.config.get('constants.REFRESH_TOKEN_LIFETIME') || 60 * 60 * 24 * 15,
  alwaysIssueNewRefreshToken: true,
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});
