import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './error.middleware';

/**
 * Validates request schemas using Zod.
 * Automatically reformats validation failures into the standardized JSON error structure.
 */
export const validateRequest = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.').replace(/^(body|query|params)\./, ''),
                    message: err.message
                }));
                
                return next(
                    new AppError(
                        400,
                        'VALIDATION_ERROR',
                        'البيانات المدخلة غير صالحة. Please check input parameters.',
                        formattedErrors
                    )
                );
            }
            next(error);
        }
    };
};
