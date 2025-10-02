// src/app/auth/login/validation/login.ts
import Joi from "joi";

export const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Email/Username is required",
  }),
  passwordHash: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});
