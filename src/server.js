import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";
import HapiSwagger from "hapi-swagger";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import { initializeApp } from "firebase/app";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { firebaseConfig } from "./firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = initializeApp(firebaseConfig);


const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "Playtime API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
  });

  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);


  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.validator(Joi);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

  server.auth.default("session");

  db.init("mongo");
  server.route(webRoutes);
  await server.start();
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
