"use strict";

const oauthServer = require(".././auth/server");
const OAuth2Server = require("oauth2-server");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const { getService } = require("../utils");

module.exports = ({ strapi }) => ({
  async count(ctx) {
    return 0;
  },
  async getToken(ctx) {
    let request = new Request({
      method: "POST",
      query: {},
      body: ctx.request.body,
      headers: ctx.req.headers,
    });

    let response = new Response({
      headers: {},
    });

    let token = oauthServer.token(request, response, {
      requireClientAuthentication: {
        // whether client needs to provide client_secret
        authorization_code: false,
      },
    });

    token = await Promise.all([token]);

    return {
      access_token: token[0].accessToken,
      access_token_expires_at: token[0].accessTokenExpiresAt,
      token_type: "Bearer",
      guest_id: token[0].guest_id,
      created_at: new Date(),
      expires_in: strapi.config.get('constants.ACCESS_TOKEN_LIFETIME') || 60 * 60 * 24 * 15,
    };
  },
  async getRefreshToken(ctx) {
    let request = new Request({
      method: "POST",
      query: {},
      body: ctx.request.body,
      headers: ctx.req.headers,
    });

    let response = new Response({
      headers: {},
    });

    let authenticate = oauthServer.authenticate(request, response, {
      scope: "test",
    });
    await Promise.all([authenticate]);

    let token = oauthServer.token(request, response, {
      requireClientAuthentication: {
        // whether client needs to provide client_secret
        authorization_code: false,
      },
    });

    token = await Promise.all([token]);

    return {
      access_token: token[0].accessToken,
      access_token_expires_at: token[0].accessTokenExpiresAt,
      token_type: "Bearer",
      refresh_token: token[0].refreshToken,
      guest_id: token[0].guest_id,
      created_at: new Date(),
      expires_in: strapi.config.get('constants.ACCESS_TOKEN_LIFETIME') || 60 * 60 * 24 * 15,
    };
  },
  extractToken(ctx) {
    let token;

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
        return null;
      }

      token = parts[1];
    } else {
      return null;
    }

    return token;
  },
  async validateToken(token) {

    let request = new Request({
      method: "POST",
      query: {},
      body: {},
      headers: { authorization: `Bearer ${token}` },
    });

    let response = new Response({
      headers: {},
    });

    let authenticate = oauthServer.authenticate(request, response);

    try {
      authenticate = await Promise.all([authenticate]);
      if (authenticate?.length) {
        return true;
      }
    } catch (ex) {
      let ttt = await getService('jwt').verify(token);
    }

    return true;
  },
});
