// ============================================================================
// JAMMAL — Auth Controller (Section 3: Registration & Authentication)
// Handles Saudi Mobile OTP, role differentiation, JWT issuance
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middleware/error.middleware';
import { JwtPayload } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

// Saudi phone: +966 5XXXXXXXX or 05XXXXXXXX
const saudiPhoneRegex = /^(\+966|0)(5\d{8})$/;
// Saudi National ID: 10-digit starting with 1 (citizen) or 2 (resident)
const saudiNationalIdRegex = /^[12]\d{9}$/;

const registerSchema = z.object({
    userType: z.enum(['customer', 'driver', 'broker']),
    fullNameEn: z.string().min(2).max(100),
    fullNameAr: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(saudiPhoneRegex, 'Invalid Saudi mobile number (+966 5XXXXXXXX)'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must include uppercase letter')
        .regex(/[a-z]/, 'Password must include lowercase letter')
        .regex(/[0-9]/, 'Password must include a number')
        .regex(/[^A-Za-z0-9]/, 'Password must include a special character'),
    nationalId: z.string().regex(saudiNationalIdRegex).optional(),
    locale: z.enum(['ar', 'en']).default('ar'),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Terms must be accepted' }) }),
    acceptPrivacy: z.literal(true, { errorMap: () => ({ message: 'Privacy policy must be accepted' }) }),
});

const driverExtrasSchema = z.object({
    driverLicenseNumber: z.string().min(1),
    vehicleType: z.enum(['pickup', 'small_lorry', 'medium_lorry', 'large_truck', 'refrigerated', 'flatbed', 'tanker', 'car_carrier', 'crane_truck']),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehicleYear: z.number().min(1990).max(2030).optional(),
    licensePlate: z.string().min(1),
    capacityKg: z.number().min(0),
    iban: z.string().min(15).max(34).optional(),
});

const brokerExtrasSchema = z.object({
    companyNameEn: z.string().min(1).max(100),
    companyNameAr: z.string().min(1).max(100),
    commercialRegistration: z.string().min(1),
    taxNumber: z.string().optional(),
    iban: z.string().min(15).max(34).optional(),
});

const loginSchema = z.object({
    identifier: z.string().min(1), // phone or email
    password: z.string().min(1),
});

const verifyOtpSchema = z.object({
    userId: z.string().uuid(),
    code: z.string().length(6),
    purpose: z.enum(['registration', 'login', 'password_reset']),
});

// ============================================================================
// HELPERS
// ============================================================================

/** Normalize Saudi phone to +966 format */
function normalizeSaudiPhone(phone: string): string {
    if (phone.startsWith('0')) {
        return `+966${phone.substring(1)}`;
    }
    return phone;
}

/** Generate 6-digit OTP */
function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Generate JWT access token */
function generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    return jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRATION || '7d' });
}

/** Generate refresh token */
function generateRefreshToken(): string {
    return uuidv4() + '-' + uuidv4();
}

/** Send OTP via SMS (placeholder — integrate Unifonic or Twilio) */
async function sendOtpSms(phone: string, code: string): Promise<void> {
    // TODO: Integrate with Unifonic (Saudi provider) or Twilio
    // For development, log to console
    console.log(`📱 OTP for ${phone}: ${code}`);

    // Example Unifonic integration:
    // await fetch('https://el.cloud.unifonic.com/rest/SMS/messages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     AppSid: process.env.UNIFONIC_APP_SID!,
    //     SenderID: process.env.UNIFONIC_SENDER_ID!,
    //     Body: `رمز التحقق من جمّال: ${code}\nYour Jammal verification code: ${code}`,
    //     Recipient: phone.replace('+', ''),
    //   }),
    // });
}

// ============================================================================
// CONTROLLERS
// ============================================================================

/**
 * POST /auth/register
 * Registers a new user with role-specific logic
 */
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        // 1. Validate base fields
        const baseResult = registerSchema.safeParse(req.body);
        if (!baseResult.success) {
            const details = baseResult.error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            }));
            return sendError(res, 'VALIDATION_ERROR', 'Invalid input data', details);
        }

        const { userType, fullNameEn, fullNameAr, email, phone, password, nationalId, locale } = baseResult.data;
        const normalizedPhone = normalizeSaudiPhone(phone);

        // 2. Check for existing user
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { phone: normalizedPhone },
                ],
            },
        });
        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? 'email' : 'phone';
            return sendError(res, 'DUPLICATE_USER', `A user with this ${field} already exists`, [
                { field, message: `${field} is already registered` },
            ], 409);
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // 4. Create user + role profile in transaction
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    userType,
                    fullNameEn,
                    fullNameAr,
                    email: email.toLowerCase(),
                    phone: normalizedPhone,
                    passwordHash,
                    nationalId,
                    locale,
                    status: 'active',
                },
            });

            // Create role-specific profile
            if (userType === 'customer') {
                await tx.customerProfile.create({
                    data: { userId: newUser.id },
                });
            } else if (userType === 'driver') {
                // Validate driver extras
                const driverResult = driverExtrasSchema.safeParse(req.body);
                if (!driverResult.success) {
                    throw new AppError('Driver details are required', 400, 'VALIDATION_ERROR');
                }
                const d = driverResult.data;

                await tx.driverProfile.create({
                    data: {
                        userId: newUser.id,
                        driverLicenseNumber: d.driverLicenseNumber,
                        verificationStatus: 'pending',
                    },
                });

                await tx.vehicle.create({
                    data: {
                        driverId: newUser.id,
                        vehicleType: d.vehicleType,
                        make: d.vehicleMake,
                        model: d.vehicleModel,
                        year: d.vehicleYear,
                        licensePlate: d.licensePlate,
                        capacityKg: d.capacityKg,
                    },
                });
            } else if (userType === 'broker') {
                const brokerResult = brokerExtrasSchema.safeParse(req.body);
                if (!brokerResult.success) {
                    throw new AppError('Broker company details are required', 400, 'VALIDATION_ERROR');
                }
                const b = brokerResult.data;

                await tx.brokerProfile.create({
                    data: {
                        userId: newUser.id,
                        companyNameEn: b.companyNameEn,
                        companyNameAr: b.companyNameAr,
                        commercialRegistration: b.commercialRegistration,
                        taxNumber: b.taxNumber,
                        verificationStatus: 'pending',
                    },
                });
            }

            return newUser;
        });

        // 5. Generate and send OTP for phone verification
        const otpCode = generateOtp();
        const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || '2') * 60 * 1000));

        await prisma.otpCode.create({
            data: {
                userId: user.id,
                code: otpCode,
                purpose: 'registration',
                expiresAt: otpExpiry,
            },
        });

        await sendOtpSms(normalizedPhone, otpCode);

        // 6. Send success response (no token yet — must verify OTP first)
        return sendSuccess(res, {
            userId: user.id,
            userType: user.userType,
            phoneVerified: false,
            message: 'Registration successful. Please verify your phone number.',
            otpExpiresInSeconds: parseInt(process.env.OTP_EXPIRY_MINUTES || '2') * 60,
        }, 'Registration successful', 201);

    } catch (error) {
        next(error);
    }
}

/**
 * POST /auth/verify-otp
 * Verifies the 6-digit OTP sent to user's phone
 */
export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
        const result = verifyOtpSchema.safeParse(req.body);
        if (!result.success) {
            return sendError(res, 'VALIDATION_ERROR', 'Invalid OTP data');
        }

        const { userId, code, purpose } = result.data;

        // Find the latest unexpired OTP for this user and purpose
        const otpRecord = await prisma.otpCode.findFirst({
            where: {
                userId,
                purpose,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!otpRecord) {
            return sendError(res, 'OTP_EXPIRED', 'OTP has expired. Please request a new one.', undefined, 400);
        }

        // Check max attempts (5 attempts allowed)
        if (otpRecord.attempts >= 5) {
            return sendError(res, 'OTP_MAX_ATTEMPTS', 'Maximum attempts reached. Request a new OTP.', undefined, 429);
        }

        // Increment attempt count
        await prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
        });

        // Verify code
        if (otpRecord.code !== code) {
            return sendError(res, 'OTP_INVALID', 'Invalid verification code');
        }

        // Mark OTP as verified
        await prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });

        // Update user phone verification status
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                phoneVerified: true,
                lastLoginAt: new Date(),
            },
        });

        // Generate tokens
        const tokenPayload: JwtPayload = {
            userId: user.id,
            userType: user.userType as JwtPayload['userType'],
            email: user.email,
            phone: user.phone,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken();

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                device: req.headers['user-agent'] || 'unknown',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });

        return sendSuccess(res, {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                userType: user.userType,
                fullNameEn: user.fullNameEn,
                fullNameAr: user.fullNameAr,
                email: user.email,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                emailVerified: user.emailVerified,
                locale: user.locale,
                profilePhotoUrl: user.profilePhotoUrl,
            },
        }, 'Phone verified successfully');

    } catch (error) {
        next(error);
    }
}

/**
 * POST /auth/resend-otp
 * Resend OTP with 30-second cooldown
 */
export async function resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId, purpose } = req.body;

        if (!userId || !purpose) {
            return sendError(res, 'VALIDATION_ERROR', 'userId and purpose are required');
        }

        // Check cooldown: no resend within 30 seconds
        const lastOtp = await prisma.otpCode.findFirst({
            where: { userId, purpose },
            orderBy: { createdAt: 'desc' },
        });

        if (lastOtp) {
            const secondsSinceLast = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
            const cooldown = parseInt(process.env.OTP_RESEND_SECONDS || '30');
            if (secondsSinceLast < cooldown) {
                return sendError(
                    res, 'OTP_COOLDOWN',
                    `Please wait ${Math.ceil(cooldown - secondsSinceLast)} seconds before requesting a new code`,
                    undefined, 429
                );
            }
        }

        // Get user
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return sendError(res, 'USER_NOT_FOUND', 'User not found', undefined, 404);
        }

        // Generate new OTP
        const otpCode = generateOtp();
        const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES || '2') * 60 * 1000));

        await prisma.otpCode.create({
            data: {
                userId: user.id,
                code: otpCode,
                purpose,
                expiresAt: otpExpiry,
            },
        });

        await sendOtpSms(user.phone, otpCode);

        return sendSuccess(res, {
            otpExpiresInSeconds: parseInt(process.env.OTP_EXPIRY_MINUTES || '2') * 60,
        }, 'Verification code sent');

    } catch (error) {
        next(error);
    }
}

/**
 * POST /auth/login
 * Login via phone/email + password
 */
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            return sendError(res, 'VALIDATION_ERROR', 'Identifier and password are required');
        }

        const { identifier, password } = result.data;

        // Determine if identifier is phone or email
        const isPhone = saudiPhoneRegex.test(identifier);
        const normalizedIdentifier = isPhone ? normalizeSaudiPhone(identifier) : identifier.toLowerCase();

        // Find user
        const user = await prisma.user.findFirst({
            where: isPhone ? { phone: normalizedIdentifier } : { email: normalizedIdentifier },
        });

        if (!user) {
            return sendError(res, 'INVALID_CREDENTIALS', 'Invalid credentials', undefined, 401);
        }

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const minutesRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            return sendError(
                res, 'ACCOUNT_LOCKED',
                `Account locked. Try again in ${minutesRemaining} minutes.`,
                undefined, 423
            );
        }

        // Check account status
        if (user.status !== 'active') {
            return sendError(res, 'ACCOUNT_SUSPENDED', `Your account is ${user.status}`, undefined, 403);
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            // Increment failed attempts
            const failedAttempts = user.failedLoginAttempts + 1;
            const updateData: any = { failedLoginAttempts: failedAttempts };

            // Lock after 5 failed attempts for 30 minutes
            if (failedAttempts >= 5) {
                updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
                updateData.failedLoginAttempts = 0;
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });

            return sendError(
                res, 'INVALID_CREDENTIALS',
                failedAttempts >= 5
                    ? 'Account locked for 30 minutes due to too many failed attempts'
                    : `Invalid credentials. ${5 - failedAttempts} attempts remaining.`,
                undefined, 401
            );
        }

        // Check phone verification
        if (!user.phoneVerified) {
            // Send new OTP
            const otpCode = generateOtp();
            const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
            await prisma.otpCode.create({
                data: {
                    userId: user.id,
                    code: otpCode,
                    purpose: 'login',
                    expiresAt: otpExpiry,
                },
            });
            await sendOtpSms(user.phone, otpCode);

            return sendSuccess(res, {
                userId: user.id,
                phoneVerified: false,
                requiresOtp: true,
            }, 'Phone verification required');
        }

        // Reset failed login attempts on successful login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });

        // Generate tokens
        const tokenPayload: JwtPayload = {
            userId: user.id,
            userType: user.userType as JwtPayload['userType'],
            email: user.email,
            phone: user.phone,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken();

        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                device: req.headers['user-agent'] || 'unknown',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        return sendSuccess(res, {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                userType: user.userType,
                fullNameEn: user.fullNameEn,
                fullNameAr: user.fullNameAr,
                email: user.email,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                emailVerified: user.emailVerified,
                locale: user.locale,
                profilePhotoUrl: user.profilePhotoUrl,
            },
        }, 'Login successful');

    } catch (error) {
        next(error);
    }
}

/**
 * POST /auth/refresh-token
 * Refresh an expired access token
 */
export async function refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return sendError(res, 'VALIDATION_ERROR', 'Refresh token is required');
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.expiresAt < new Date()) {
            return sendError(res, 'INVALID_TOKEN', 'Invalid or expired refresh token', undefined, 401);
        }

        const user = storedToken.user;
        const tokenPayload: JwtPayload = {
            userId: user.id,
            userType: user.userType as JwtPayload['userType'],
            email: user.email,
            phone: user.phone,
        };

        const newAccessToken = generateAccessToken(tokenPayload);

        return sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');

    } catch (error) {
        next(error);
    }
}

/**
 * POST /auth/logout
 * Invalidate refresh token
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
        }
        return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
        next(error);
    }
}
