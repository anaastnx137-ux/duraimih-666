"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const error_middleware_1 = require("./error.middleware");
/**
 * Validates request schemas using Zod.
 * Automatically reformats validation failures into the standardized JSON error structure.
 */
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.').replace(/^(body|query|params)\./, ''),
                    message: err.message
                }));
                return next(new error_middleware_1.AppError(400, 'VALIDATION_ERROR', 'البيانات المدخلة غير صالحة. Please check input parameters.', formattedErrors));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
