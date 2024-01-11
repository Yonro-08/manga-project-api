import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { validationResult } from "express-validator";
import UserModel from "../models/user.models.js";

export const getMe = async (req, res, next) => {
	try {
		const { userId } = req;

		const user = await UserModel.findById(userId);

		if (!user) {
			res.status(404).json({
				message: "Пользователь не найден",
			});
		}

		const { passwordHash, ...userData } = user._doc;

		res.json(userData);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Нет доступа!",
		});
	}
};

export const getLogin = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await UserModel.findOne({ username });

		if (!user) {
			return res.status(404).json({
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
			message: "Нет удалось авторизоваться!",
		});
	}
};

export const createUser = async (req, res) => {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const { username, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const user = new UserModel({
			username,
			passwordHash: hash,
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
