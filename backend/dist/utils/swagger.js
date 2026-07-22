"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
/**
 * OpenAPI 3.0 API Specification in JSON format for the Saud Law Office system.
 */
exports.swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "مكتب الدكتور سعود بن فهد الدريميح للمحاماة - API Docs",
        version: "1.0.0",
        description: "Enterprise backend service documentation for public client forms and dashboard panels."
    },
    servers: [
        {
            url: "/api"
        }
    ],
    paths: {
        "/auth/login": {
            post: {
                summary: "تسجيل الدخول للنظام",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "admin@draymih-law.sa" },
                                    password: { type: "string", example: "••••••••" }
                                },
                                required: ["email", "password"]
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        accessToken: { type: "string" },
                                        user: { type: "object" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/consultations": {
            post: {
                summary: "تقديم طلب استشارة جديدة",
                description: "Accepts multipart form-data for consultations details and optional attachment documents.",
                responses: {
                    201: {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        referenceNumber: { type: "string", example: "LAW-20260712-A1B2C3" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/services": {
            get: {
                summary: "قائمة الخدمات القانونية",
                responses: {
                    200: { description: "Success" }
                }
            }
        },
        "/blog": {
            get: {
                summary: "قائمة المقالات المنشورة",
                responses: {
                    200: { description: "Success" }
                }
            }
        }
    }
};
