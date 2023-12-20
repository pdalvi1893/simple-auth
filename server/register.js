"use strict";

const authStrategy = require("./strategies/users-permissions");

const { randomUUID } = require("crypto");

module.exports = ({ strapi }) => {
  // registeration phase
  strapi.container.get("auth").register("content-api", authStrategy);

  strapi.eventHub.addListener("entry.create", async (listener) => {
    await strapi.entityService.update(
      "plugin::simple-auth.token-store",
      listener.entry.id,
      {
        data: {
          guest_id: randomUUID(),
        },
      }
    );
  });
};
