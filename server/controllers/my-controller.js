'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('simple-auth')
      .service('myService')
      .getWelcomeMessage();
  },
});
