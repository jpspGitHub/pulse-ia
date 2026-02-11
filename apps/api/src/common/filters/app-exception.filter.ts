import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { AppError } from '../errors/app-error';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof AppError) {
      response.status(exception.httpStatus).json({
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details ?? null,
        },
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      response.status(status).json({
        error: {
          code: 'HTTP_ERROR',
          message: typeof payload === 'string' ? payload : exception.message,
          details: payload,
        },
      });
      return;
    }

    if (exception instanceof Error) {
      response.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: exception.message,
          details: null,
        },
      });
      return;
    }

    response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected error',
        details: null,
      },
    });
  }
}
