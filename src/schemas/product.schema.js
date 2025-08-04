const Joi = require("joi");

const productSchema = Joi.object({
  nombre: Joi.string().max(50).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es un campo obligatorio.",
    "string.max": "El nombre no puede tener más de 50 caracteres.",
    "any.required": "El nombre es un campo obligatorio.",
  }),
  precio: Joi.number().min(1).max(100000).required().messages({
    "number.base": "El precio debe ser un número.",
    "number.max": "El precio no puede ser mayor a 100000.",
    "number.min": "El precio no puede ser 0 o negativo.",
    "any.required": "El precio es un campo obligatorio.",
  }),
  imagen: Joi.string().max(80).required().messages({
    "string.base": "La imagen debe ser una cadena de texto.",
    "string.empty": "La imagen es un campo obligatorio.",
    "string.max": "La imagen no puede tener más de 80 caracteres.",
    "any.required": "La imagen es un campo obligatorio.",
  }),
  stock: Joi.boolean().required().messages({
    "boolean.base": "El stock debe ser un valor booleano.",
    "any.required": "El stock es un campo obligatorio.",
  }),
  IdCategoria: Joi.number().min(1).required().messages({
    "any.required": "El IdCategoria es un campo obligatorio.",
    "number.base": "El IdCategoria debe ser un número.",
    "number.min": "El IdCategoria no puede ser 0 o negativo.",
  }),
});

const updateProductSchema = Joi.object({
  nombre: Joi.string().max(50).messages({
    "string.base": "El nombre debe ser un texto.",
    "string.max": "El nombre no puede tener más de 50 caracteres.",
  }),
  precio: Joi.number().min(0).max(100000).messages({
    "number.base": "El precio debe ser un número.",
    "number.max": "El precio no puede ser mayor a 100000.",
    "number.min": "El precio no puede ser 0 o negativo.",
  }),
  imagen: Joi.string().max(80).messages({
    "string.base": "La imagen debe ser una cadena de texto.",
    "string.max": "La imagen no puede tener más de 80 caracteres.",
  }),
  stock: Joi.boolean().messages({
    "boolean.base": "El stock debe ser un valor booleano.",
  }),
  IdCategoria: Joi.number().optional().messages({
    "number.base": "El IdCategoria debe ser un número.",
  }),
  estado: Joi.boolean().messages({
    "boolean.base": "El estado debe ser un valor booleano.",
  }),
});

const categorySchema = Joi.object({
  nombre: Joi.string().max(50).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es un campo obligatorio.",
    "string.max": "El nombre no puede tener más de 50 caracteres.",
    "any.required": "El nombre es un campo obligatorio.",
  }),
  imagen: Joi.string().max(80).required().messages({
    "string.base": "La imagen debe ser una cadena de texto.",
    "string.empty": "La imagen es un campo obligatorio.",
    "string.max": "La imagen no puede tener más de 80 caracteres.",
    "any.required": "La imagen es un campo obligatorio.",
  }),
});

const userSchema = Joi.object({
  nombre: Joi.string().max(30).required().messages({
    "string.base": "El nombre debe ser un texto.",
    "string.empty": "El nombre es un campo obligatorio.",
    "string.max": "El nombre no puede tener más de 30 caracteres.",
    "any.required": "El nombre es un campo obligatorio.",
  }),
  correo: Joi.string().email().required().messages({
    "string.base": "El correo debe ser un texto.",
    "string.email": "El correo debe ser un correo electrónico válido.",
    "any.required": "El correo es un campo obligatorio.",
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.base": "La contraseña debe ser un texto.",
      "string.empty": "La contraseña es un campo obligatorio.",
      "string.pattern.base":
        "La contraseña debe tener entre 3 y 30 caracteres y solo contener letras y números.",
      "any.required": "La contraseña es un campo obligatorio.",
    }),
});

const loginSchema = Joi.object({
  correo: Joi.string().email().required().messages({
    "string.base": "El correo debe ser un texto.",
    "string.email": "El correo debe ser un correo electrónico válido.",
    "any.required": "El correo es un campo obligatorio.",
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.base": "La contraseña debe ser un texto.",
      "string.empty": "La contraseña es un campo obligatorio.",
      "string.pattern.base":
        "La contraseña debe tener entre 3 y 30 caracteres y solo contener letras y números.",
      "any.required": "La contraseña es un campo obligatorio.",
    }),
});

module.exports = {
  categorySchema,
  productSchema,
  userSchema,
  updateProductSchema,
  loginSchema,
};
