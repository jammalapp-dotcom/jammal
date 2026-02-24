// JAMMAL — Auth Routes (Section 15.2)
import { Router } from 'express';
import {
    register,
    verifyOtp,
    resendOtp,
    login,
    refreshAccessToken,
    logout,
} from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh-token', refreshAccessToken);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/resend-otp', resendOtp);
