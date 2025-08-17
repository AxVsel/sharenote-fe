// src/app/auth/login/validation/login.ts
import Joi from "joi";

export const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Email/Username wajib diisi",
  }),
  passwordHash: Joi.string().min(6).required().messages({
    "string.empty": "Password wajib diisi",
    "string.min": "Password minimal 6 karakter",
  }),
});
