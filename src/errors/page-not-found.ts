import { HttpStatusCode } from '@/enums';

import { AppError, Options as AppOptions } from './app';

interface Options extends Omit<AppOptions, 'message'> {
  path: string;
  method: string;
  message?: string;
}

export class PageNotFoundError extends AppError {
  constructor({ path, method, ...options }: Options) {
    super({
      code: 'page_not_found',
      metadata: { path, method },
      statusCode: HttpStatusCode.NOT_FOUND,
      message: 'error.page_not_found',
      ...options,
    });

    this.name = 'PageNotFoundError';
  }
}
