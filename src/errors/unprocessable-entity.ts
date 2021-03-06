import { HttpStatusCode } from '@/enums';

import { AppError, Options } from './app';

export class UnprocessableEntityError extends AppError {
  constructor(options?: Options) {
    super({
      code: 'unprocessable_entity',
      statusCode: HttpStatusCode.UNPROCESSABLE_ENTITY,
      message: 'error.unprocessable_entity',
      ...options,
    });

    this.name = 'UnprocessableEntityError';
  }
}
