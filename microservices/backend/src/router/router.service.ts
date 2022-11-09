import { Injectable } from '@nestjs/common';

@Injectable()
export class RouterService {
  public build<T extends Record<string, string>>(url: string, parameters: T) {
    const [basePath, queryParams] = url.split('?');

    let resultBasePath = basePath + '/';
    let resultQueryParams = queryParams || '';

    Object.entries(parameters).forEach(([k, v]) => {
      resultBasePath = resultBasePath.replaceAll(`:${k}/`, `${v}/`);
      resultQueryParams = resultQueryParams.replaceAll(`={${k}}`, `=${v}`);
    });

    resultBasePath = resultBasePath.slice(0, -1);

    if (queryParams) return `${resultBasePath}?${resultQueryParams}`;

    return resultBasePath;
  }
}
