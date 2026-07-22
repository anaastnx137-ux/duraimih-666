import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address format.'),
        password: z.string().min(1, 'Password is required.')
    })
});

export const passwordResetRequestSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address format.')
    })
});

export const passwordResetSchema = z.object({
    body: z.object({
        token: z.string().min(1, 'Reset token is required.'),
        newPassword: z.string().min(12, 'Password must be at least 12 characters long.')
    })
});

export const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string().min(1, 'Current password is required.'),
        newPassword: z.string().min(12, 'New password must be at least 12 characters long.')
    })
});
