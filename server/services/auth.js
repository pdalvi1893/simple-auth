"use strict";

const oauthServer = require(".././auth/server");
const OAuth2Server = require("oauth2-server");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

module.exports = ({ strapi }) => ({
  async count(ctx) {
    // var tt = oauthServer.options.model.getClient();
    // //let l = new Request(ctx.req);
    // Promise.all([tt]).then((values) => {
    //   console.log(values);
    // });

    let request = new Request({
      method: "POST",
      query: {},
      body: ctx.request.body,
      headers: ctx.req.headers,
      //headers: { Authorization: "Bearer foobar" },
    });

    let response = new Response({
      headers: {},
    });

    var ttt = oauthServer.token(request, response, {
      requireClientAuthentication: {
        // whether client needs to provide client_secret
        authorization_code: false,
      },
    });

    var test = ttt;

    let ss = await Promise.all([ttt]);

    return ss[0];
    // Promise.all([ttt]).then((values) => {
    //   console.log(values);
    // });
    //return await strapi.query("plugin::simple-auth.auth").count();
  },
});

// 'use strict';

// /**
//  *  service
//  */

// const { createCoreService } = require('@strapi/strapi').factories;

// module.exports = createCoreService('plugin::simple-auth.auth');
