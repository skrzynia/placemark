import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { commentController } from "./controllers/comment-controller.js";
import { accountSettingController } from "./controllers/account-settings-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/about", config: aboutController.index },

  {method: "GET", path: "/account", config: accountSettingController.index},
  { method: "POST", path: "/account/update", config: accountSettingController.updateAccount },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addplacemark", config: dashboardController.addPlacemark},
  { method: "GET", path: "/dashboard/deleteplacemark/{id}", config: dashboardController.deletePlacemark },
  { method: "POST", path: "/dashboard/filteredResults", config: dashboardController.filteredResults},


  { method: "GET", path: "/placemark/{id}", config: commentController.index },
  { method: "POST", path: "/placemark/{id}/addcomment", config: commentController.addComment },
  { method: "GET", path: "/placemark/{id}/deletecomment/{commentid}", config: commentController.deleteComment },
  

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },
];
