const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    userName: String!
    createdAt: String!
  }

  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
  }
`;
