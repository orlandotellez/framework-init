import { z } from "zod"

export const LoginDtoSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const RefreshTokenDtoSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token is required"),
})

export type LoginDto = z.infer<typeof LoginDtoSchema>
export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>