import { db } from "../models/db.js";
import { UserSpec } from "../models/joi-schemas.js";


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
      handler: async function (request, h) {
        const updatedAccount = request.payload;
        const id = request.auth.credentials
        const user = await db.userStore.getUserById(id._id)
        console.log(user)
        
        await db.userStore.updateAccount(user, updatedAccount);
        return h.redirect("/dashboard");
    },
  },
};