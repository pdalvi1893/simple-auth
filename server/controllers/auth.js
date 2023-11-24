// server/controller/task.js
"use strict";

module.exports = {
    async count(ctx) {
      ctx.body = await strapi
        .plugin('simple-auth')
        .service('auth')
        .count(ctx);
    },
  };

// 'use strict';

// /**
//  *  controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('plugin::simple-auth.auth');
