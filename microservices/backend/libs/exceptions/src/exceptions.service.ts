import { Injectable } from '@nestjs/common';

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
    const { exceptionsPath } = args;

    super.initialise(args);

    const codes = [] as string[];

    const matches = await glob(exceptionsPath);

    for (const match of matches) {
      const fileContent = readFileSync(match, 'utf-8');

      const classNameRegex = new RegExp(
        'export class (.*) extends Exception {',
      );

      const customCodeRegex = new RegExp("getCode[(][)] {\n    return '(.*)';");

      const className = classNameRegex.exec(fileContent)?.[1];
      const code = customCodeRegex.exec(fileContent)?.[1];

      codes.push(code ?? this.getCode(className as string));
    }

    const content = `{
          ${codes
            .map((code) => {
              const name = code
                .split('_')
                .map((subname) => subname.toLowerCase())
                .join(' ');
              return `"${code}": "${name[0].toUpperCase() + name.slice(1)}"`;
            })
            .join(',\n\t')}
    }`;

    super.write(content);

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
