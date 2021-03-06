import { IncomingHttpHeaders } from 'node:http';
import https, { RequestOptions } from 'node:https';

import { HttpMethod, HttpStatusCode } from '@/enums';
import { InternalServerError } from '@/errors';

export interface HttpRequest extends RequestOptions {
  url: string;
  body?: string;
  method?: HttpMethod;
}

interface Response<T = any> {
  body: T;
  statusCode: number;
  headers: IncomingHttpHeaders;
}

const jsonParse = (value: any) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const makeError = (e: any, metadata: any) =>
  new InternalServerError({
    metadata,
    message: e.message,
    originalError: e,
  });

export const httpRequest = async <T = any>(
  options: HttpRequest,
): Promise<Response<T>> => {
  const { url, body, ...rest } = options;
  rest.method = rest.method ?? HttpMethod.GET;

  const response = await new Promise<Response>((resolve, reject) => {
    const request = https.request(url, rest, async (res) => {
      const chunks: any[] = [];

      res.on('error', (e) => reject(makeError(e, options)));
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const data = Buffer.concat(chunks).toString().trim();
        const { statusCode = HttpStatusCode.OK, headers } = res;

        resolve({
          body: jsonParse(data),
          statusCode: Number(statusCode),
          headers,
        });
      });
    });

    request.on('error', (e) => reject(makeError(e, options)));

    if (body?.trim()?.length) {
      request.write(body);
    }

    request.end();
  });

  return response;
};
