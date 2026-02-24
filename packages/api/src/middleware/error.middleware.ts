// ============================================================================
// JAMMAL — Error Handling Middleware
// ============================================================================

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    public statusCode: number;
    public code: string;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
            timestamp: new Date().toISOString(),
        });
    }

    console.error('Unhandled error:', err);
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
        },
        timestamp: new Date().toISOString(),
    });
}
