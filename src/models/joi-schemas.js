import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
    picture: Joi.any().optional(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const CommentSpec = Joi.object()
  .keys({
    description: Joi.string().required().example("Some Comment"),
      rating: Joi.string().required().example("1"),
    placemarkid: IdSpec,
  })
  .label("Comment");

export const CommentSpecPlus = CommentSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CommentPlus");

export const CommentArraySpec = Joi.array().items(CommentSpecPlus).label("CommentArray");

export const PlacemarkSpec = Joi.object()
  .keys({
    title: Joi.string().required().example("Some Restaurant"),
    description: Joi.string().required().example("Best dinner in Dublin"),
    address: Joi.string().required().example("Some Road, Dublin 8, D08AAAA"),
    picture: Joi.any().optional(),
    userid: IdSpec,
  })
  .label("Placemark");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");

