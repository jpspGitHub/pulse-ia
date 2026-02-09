import { AppError } from './app-error';

export const Errors = {
  unauthorized(message = 'Unauthorized') {
    return new AppError('UNAUTHORIZED', 401, message);
  },
  forbidden(message = 'Forbidden') {
    return new AppError('FORBIDDEN', 403, message);
  },
  notFound(message = 'Not found') {
    return new AppError('NOT_FOUND', 404, message);
  },
  validation(details: unknown, message = 'Validation error') {
    return new AppError('VALIDATION_ERROR', 400, message, details);
  },
  internal(message = 'Internal server error', details?: unknown) {
    return new AppError('INTERNAL_ERROR', 500, message, details);
  },
};
