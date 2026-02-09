export class AppError extends Error {
  readonly code: string;
  readonly httpStatus: number;
  readonly details?: unknown;

  constructor(
    code: string,
    httpStatus: number,
    message: string,
    details?: unknown,
    cause?: unknown,
  ) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
    if (cause) {
      this.cause = cause;
    }
  }
}
