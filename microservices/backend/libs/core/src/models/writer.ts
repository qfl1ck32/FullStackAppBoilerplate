import { WriterArgs } from './defs';

import { makeArray } from '../core.utils';
import { FileNameMissingException } from '../exceptions/file-name-missing.exception';

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

export class Writer {
  protected writePaths: string[];
  protected fileName: string;

  protected initialise(args: WriterArgs) {
    const { writePath, fileName } = args;

    this.writePaths = makeArray(writePath);
    this.fileName = fileName;
  }

  protected write(content: string, fileName?: string) {
    fileName = fileName || this.fileName;

    if (!fileName) {
      throw new FileNameMissingException();
    }

    for (const writePath of this.writePaths) {
      const filePath = resolve(writePath, fileName);

      writeFileSync(filePath, content);
      execSync(`prettier ${filePath} --write`);
    }
  }
}
