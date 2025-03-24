import zod from 'zod';

const signUpSchema = zod.object({
    name : zod.string(),
    email : zod.string().email(),
    password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Minimum length check
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    ),
    age : zod.number(),
});

const loginSchema = zod.object({
    email : zod.string().email(),
    password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Minimum length check
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    )
});

const resetPasswordSchema = zod.object({
  password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" }) // Minimum length check
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    )
})

export {signUpSchema,loginSchema, resetPasswordSchema};