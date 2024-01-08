import { body } from "express-validator";

export const registerValidation = [
	body("username", "Никнейм должен быть минимум 5 символов").isLength({
		min: 5,
	}),
	body("password", "Пароль должен быть минимум 5 символов").isLength({
		min: 5,
	}),
];
