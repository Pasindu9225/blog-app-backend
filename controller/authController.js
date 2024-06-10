const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const UserDTO = require("../dto/user");
const JWTServices = require("../services/JWTServices");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d@#$%^&+=!]{8,25}$/;

const authController = {
  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confermPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, username, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email is already registered, use another email",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username is already registered, use another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let accessToken;
    let refreshToken;

    let user;
    try {
      const userToRegister = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      accessToken = JWTServices.signAccessToken({ _id: user.id }, "30m");
      refreshToken = JWTServices.signRefreshToken({ _id: user.id }, "60m");
    } catch (error) {
      return next(error);
    }

    try {
      await JWTServices.storeRefreshToken(refreshToken, user._id);
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);
    return res.status(201).json({ user: userDto, auth: true });
  },

  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    let user;

    try {
      user = await User.findOne({ username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };
        return next(error);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTServices.signAccessToken({ _id: user.id }, "30m");
    const refreshToken = JWTServices.signRefreshToken({ _id: user.id }, "60m");

    try {
      await RefreshToken.updateOne(
        { userId: user._id },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDTO(user);
    return res.status(200).json({ user: userDto, auth: true });
  },

  async logout(req, res, next) {
    console.log(req);
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ user: null, auth: false });
  },
};

module.exports = authController;
