import { PlacemarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import sanitizeHtml from "sanitize-html";
import fs from 'fs';

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const placemarks = await db.placemarkStore.getAllPlacemarks();
      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        placemarks: placemarks,
      };
      return h.view("dashboard-view", viewData);
    },
  },
  filteredResults: {
    handler: async function(request, h) {
     const placemarks = await db.placemarkStore.getAllPlacemarks();
     const filter = request.payload.filter;
     const filteredResults = [];
     for (let i = 0; i< placemarks.length; i++)
     {
       for(let j = 0; j < Object.values(placemarks[i]).length; j++)
       {
         if (typeof Object.values(placemarks[i])[j] == "string")
         {
          if (Object.values(placemarks[i])[j].includes(filter))
          {
            filteredResults.push(placemarks[i]);
            break;
          }
         }
       }
     }

     const viewData = {
       placemarks: filteredResults
     };
     return h.view("dashboard-view", viewData);


    }
  },

  addPlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false},
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Add Placemark error", errors: error.details }).takeover().code(400);
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
        const path = "./public/images/places/" + name;
        const file = fs.createWriteStream(path);
        file.on('error', (err) => console.error(err));
        data.picture.pipe(file);

        const loggedInUser = request.auth.credentials;
        const newPlacemark = {
          userid: loggedInUser._id,
          title: sanitizeHtml(request.payload.title),
          description: sanitizeHtml(request.payload.description),
          address: sanitizeHtml(request.payload.address),
          date: new Date().toDateString(),
          time: new Date().toLocaleTimeString(),
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          placePicture: name,
          pictureName: loggedInUser.pictureName
        };
        await db.placemarkStore.addPlacemark(newPlacemark);
        return h.redirect("/dashboard");
      }
      return h.redirect("/")
    }
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      fs.unlink("./public/images/places/"+placemark.placePicture, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed");
        }
      });
      await db.placemarkStore.deletePlacemarkById(placemark._id);
      return h.redirect("/dashboard");
    },
  },
};
