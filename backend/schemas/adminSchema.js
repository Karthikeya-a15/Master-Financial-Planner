import zod from 'zod';

const loginSchema = zod.object({
    email : zod.string().email(),
    password : zod.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .refine(
      (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      }
    )
});

export { loginSchema };