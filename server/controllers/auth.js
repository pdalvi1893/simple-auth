// server/controller/task.js
"use strict";

module.exports = {
    async count(ctx) {
      ctx.body = await strapi
        .plugin('simple-auth')
        .service('auth')
        .count(ctx);
    },
    async token(ctx){
      ctx.body = await strapi
        .plugin('simple-auth')
        .service('auth')
        .getToken(ctx);
    },
    async refreshToken(ctx){
      ctx.body = await strapi
        .plugin('simple-auth')
        .service('auth')
        .getRefreshToken(ctx);
    },
  };

// 'use strict';

// /**
//  *  controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('plugin::simple-auth.auth');
