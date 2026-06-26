export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado') {
    super(401, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisição inválida') {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Não encontrado') {
    super(404, message);
  }
}
