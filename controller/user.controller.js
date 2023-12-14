import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.models.js";

export const getUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, avatar } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new UserModel({
      username,
      passwordHash: hash,
      avatar,
    });

    const newUser = await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "pass",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = newUser._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};
