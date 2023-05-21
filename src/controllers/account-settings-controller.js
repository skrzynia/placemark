import { db } from "../models/db.js";
import { UserSpec } from "../models/joi-schemas.js";
import fs from "fs";
import bcrypt from "bcrypt";


export const accountSettingController = {
    index: {
      handler: async function (request, h) {
        const user = request.auth.credentials
        const placemarksDb = await db.placemarkStore.getUserPlaylists(user._id);
        console.log(placemarksDb)
        const viewData = {
          title: "Account settings",
          user: user,
          placemarks: placemarksDb
        };
        return h.view("account-settings-view", viewData);
      },
    },

    updateAccount: {
      validate: {
        payload: UserSpec,
        options: { abortEarly: false },
        failAction: function (request, h, error) {
          return h.view("account-settings-view", { title: "Add track error", errors: error.details }).takeover().code(400);
        },
      },
      payload: {
        maxBytes: 209715200,
        parse: true,
        allow: "multipart/form-data",
        multipart: { output: "stream" },
      },
      handler: async function (request, h) {
        const data = request.payload;
        if (data.picture) {
          const name = data.picture.hapi.filename;
          const path = "./public/images/accountphoto/" + name;
          const file = fs.createWriteStream(path);
          file.on('error', (err) => console.error(err));
          data.picture.pipe(file);

          const firstName = request.payload.firstName;
          const lastName = request.payload.lastName;
          const email = request.payload.email;
          const password = await bcrypt.hash(request.payload.password, 10);
          const pictureName = name;
          const updatedAccount = {firstName,lastName,email,password,pictureName};

          console.log(updatedAccount);

          const id = request.auth.credentials;
          const user = await db.userStore.getUserById(id._id);
          console.log(user);
          await db.userStore.updateAccount(user, updatedAccount);
          return h.redirect("/dashboard");
        }
        return h.redirect("/account")
      },
  },
};