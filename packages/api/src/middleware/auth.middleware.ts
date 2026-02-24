// ============================================================================
// JAMMAL — JWT Auth Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

export interface JwtPayload {
    userId: string;
    userType: 'customer' | 'driver' | 'broker' | 'admin' | 'support';
    email: string;
    phone: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('Authentication required', 401, 'AUTH_REQUIRED');
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'fallback-secret';
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof AppError) throw error;
        next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
    }
}

export function authorize(...roles: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'));
        }
        if (!roles.includes(req.user.userType)) {
            return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
        }
        next();
    };
}
