import { ApiResponse } from "./response.interface";

export class CustomError extends Error implements ApiResponse {
    public statusCode: number;
    public messages: string[];
    public data: null;
    public errors: any[];

    constructor(messages: string | string[], statusCode: number, errors: any = null) {
        super(typeof messages === "string" ? messages : messages.join(" <--> "));
        this.statusCode = statusCode;
        this.messages = Array.isArray(messages) ? messages : [messages];
        this.data = null;

        // Normalize errors into an array of strings
        this.errors = this.normalizeErrors(errors);

        Error.captureStackTrace(this, this.constructor);
    }

    private normalizeErrors(errors: any): any[] {
        if (!errors) {
            return [];
        }

        // Handle Sequelize validation errors
        if (errors.errors && Array.isArray(errors.errors)) {
            return errors.errors.map((err: any) => err.message);
        }

        // Handle string errors
        if (typeof errors === "string") {
            return [errors];
        }

        // Handle array of errors
        if (Array.isArray(errors)) {
            return errors.map((err) => (typeof err === "string" ? err : JSON.stringify(err)));
        }

        // Fallback: Convert the error object to a string
        return [JSON.stringify(errors)];
    }

    toResponse(): ApiResponse {
        return {
            statusCode: this.statusCode,
            messages: this.messages,
            data: this.data,
            errors: this.errors,
        };
    }
}