const postsResolvers = require("./posts");
const userResolvers = require("./users");
const commentsResolvers = require("./users");
module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
