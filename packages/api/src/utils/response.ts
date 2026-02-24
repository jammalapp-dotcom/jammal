// ============================================================================
// JAMMAL — Standardized API Response Helpers (Section 15.3)
// ============================================================================

import { Response } from 'express';

interface PaginationMeta {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export function sendSuccess<T>(res: Response, data: T, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    });
}

export function sendPaginated<T>(res: Response, data: T[], pagination: PaginationMeta) {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            current_page: pagination.currentPage,
            per_page: pagination.perPage,
            total_items: pagination.totalItems,
            total_pages: pagination.totalPages,
            has_next: pagination.hasNext,
            has_prev: pagination.hasPrev,
        },
        timestamp: new Date().toISOString(),
    });
}

export function sendError(
    res: Response,
    code: string,
    message: string,
    details?: { field: string; message: string }[],
    statusCode = 400
) {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(details && { details }),
        },
        timestamp: new Date().toISOString(),
    });
}
