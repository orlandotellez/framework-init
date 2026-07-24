import { Router } from "../../../infrastructure/http/router";
import { authController } from "./auth.controller";
import { authGuard, adminGuard } from "../../../core/guard/auth.guard";

const authRouter = new Router();

// PUBLIC ROUTES
authRouter.post("/register-store", authController.registerStore);
authRouter.post("/register", authGuard, adminGuard, authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

// Email Verification
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.post("/resend-verification", authController.resendVerification);

// Password Reset
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

// PROTECTED ROUTES
authRouter.get("/sessions", authGuard, authController.getUserSessions);
authRouter.delete("/sessions/:sessionId", authGuard, authController.revokeSession);

export { authRouter };
