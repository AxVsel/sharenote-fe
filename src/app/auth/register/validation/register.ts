import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.alphanum": "Username hanya boleh huruf/angka",
    "string.min": "Username minimal 3 karakter",
    "string.max": "Username maksimal 30 karakter",
  }),
  fullname: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Fullname tidak boleh kosong",
    "string.min": "Fullname minimal 3 karakter",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong",
      "string.email": "Format email tidak valid",
    }),
  passwordHash: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 6 karakter",
  }),
});
