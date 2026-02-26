// ============================================================================
// JAMMAL — API Client Configuration
// ============================================================================

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
    token?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { token, ...fetchOptions } = options;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...fetchOptions,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                ...data,
            };
        }

        return data;
    }

    // ── Auth ──
    async register(body: any) {
        return this.request('/v1/auth/register', { method: 'POST', body: JSON.stringify(body) });
    }

    async login(identifier: string, password: string) {
        return this.request('/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ identifier, password }),
        });
    }

    async verifyOtp(userId: string, code: string, purpose: string) {
        return this.request('/v1/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ userId, code, purpose }),
        });
    }

    async resendOtp(userId: string, purpose: string) {
        return this.request('/v1/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ userId, purpose }),
        });
    }

    async refreshToken(refreshToken: string) {
        return this.request('/v1/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    async logout(refreshToken: string) {
        return this.request('/v1/auth/logout', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
    }

    // ── Shipments ──
    async createShipment(body: any, token: string) {
        return this.request('/v1/shipments', { method: 'POST', body: JSON.stringify(body), token });
    }

    async getShipments(params: Record<string, string> = {}, token: string) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/v1/shipments?${query}`, { token });
    }

    async getShipment(id: string, token: string) {
        return this.request(`/v1/shipments/${id}`, { token });
    }

    async cancelShipment(id: string, token: string) {
        return this.request(`/v1/shipments/${id}/cancel`, { method: 'POST', token });
    }

    // ── Bids ──
    async placeBid(shipmentId: string, bidAmount: number, message: string | undefined, token: string) {
        return this.request('/v1/bids', {
            method: 'POST',
            body: JSON.stringify({ shipmentId, bidAmount, message }),
            token,
        });
    }

    async acceptBid(shipmentId: string, bidId: string, token: string) {
        return this.request(`/v1/bids/${bidId}/accept`, {
            method: 'POST',
            body: JSON.stringify({ shipmentId }),
            token,
        });
    }

    // ── Driver ──
    async toggleDriverOnline(isOnline: boolean, latitude: number, longitude: number, token: string) {
        return this.request('/v1/drivers/status', {
            method: 'PUT',
            body: JSON.stringify({ isOnline, latitude, longitude }),
            token,
        });
    }

    async getAvailableShipments(token: string) {
        return this.request('/v1/drivers/available-shipments', { token });
    }
}

export const api = new ApiClient(API_BASE_URL);
