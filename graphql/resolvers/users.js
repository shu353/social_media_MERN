const bcrypt = require("bcryptjs");
const jsonWaitToken = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");

let generateToken = (user) => {
  return jsonWaitToken.sign(
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async login(_, { userName, password }) {
      const { errors, valid } = validateLoginInput(userName, password);

      if (!valid) {
        throw new UserInputError("errors", { errors });
      }

      const user = await User.findOne({ userName });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const matchPassword = await bcrypt.compare(password, user.password);

      if (!matchPassword) {
        errors.general = "Crentials are wrong";
        throw new UserInputError("Credentials are wrong", { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { userName, email, password, confirmPassword } },
      contex,
      info
    ) {
      //  valited user data
      const { valid, errors } = validateRegisterInput(
        userName,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("errors", { errors });
      }
      // TODO: validate user
      const user = await User.findOne({ userName });

      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            userName: "username is taken",
          },
        });
      }

      // : hash password and create aut token

      password = await bcrypt.hash(password, 12);

      const newUser = User({
        email,
        password,
        userName,
        createdAt: new Date().toISOString(),
      });
      const result = await newUser.save();

      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};
