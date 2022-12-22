import { Injectable } from '@nestjs/common';

import { mergeDeep } from '@app/core/core.utils';
import { Writer } from '@app/core/models/writer';
import { LoggerService } from '@app/logger';

import { ExtractArgs } from './defs';

import { readFileSync } from 'fs';
import { glob as g } from 'glob';
import { promisify } from 'util';

const glob = promisify(g);

@Injectable()
export class ExceptionsService extends Writer {
  constructor(protected readonly loggerService: LoggerService) {
    super();
  }

  async extract(args: ExtractArgs) {
    const { exceptionsPath, fileName, writePath } = args;

    super.initialise(args);

    const exceptions = [] as {
      code: string;
      metadata: string[];
    }[];

    const matches = await glob(exceptionsPath);

    for (const match of matches) {
      const fileContent = readFileSync(match, 'utf-8');

      const classNameRegex = new RegExp(
        'export class (.*) extends Exception(.*){',
      );

      const metadataRegex = new RegExp('Exception<{(.*)}>', 'gs');

      const shouldHide = fileContent.indexOf('// @hide-on-ui') !== -1;

      if (shouldHide) continue;

      const customCodeRegex = new RegExp("getCode[(][)] {\n    return '(.*)';");

      const className = classNameRegex.exec(fileContent)?.[1];
      const code = customCodeRegex.exec(fileContent)?.[1];
      const metadata = (metadataRegex.exec(fileContent)?.[1] || '')
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((r) => r.trim())
        .map((r) => {
          return r.split(/([?][:])|([:])/)[0];
        });

      exceptions.push({
        code: code ?? this.getCode(className as string),
        metadata,
      });
    }

    const content = JSON.parse(`{
          ${exceptions
            .map((exception) => {
              const { code, metadata } = exception;

              const name = code
                .split('_')
                .map((subname) => subname.toLowerCase())
                .join(' ');

              const finalName = name[0].toUpperCase() + name.slice(1);

              const metadataString = metadata
                .map((arg) => `{{ ${arg} }}`)
                .join(' ');

              return `"${code}": "${finalName}${
                metadataString ? ` ${metadataString}` : ''
              }"`;
            })
            .join(',\n\t')}
    }`);

    const existingExceptionsFile = readFileSync(`${writePath}/${fileName}`, {
      encoding: 'utf-8',
    });

    if (existingExceptionsFile) {
      await mergeDeep({
        target: content,
        sources: [JSON.parse(existingExceptionsFile)],
      });
    }

    super.write(JSON.stringify(content));

    this.loggerService.info('Success');
  }

  private getName(className: string) {
    const name = className.match(/[A-Z][a-z]+/g) as RegExpMatchArray;

    name.pop();

    return name;
  }

  private getCode(className: string) {
    const name = this.getName(className);

    return name.map((subname) => subname.toUpperCase()).join('_');
  }
}
