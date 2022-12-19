import { WriterArgs } from './defs';

import { makeArray } from '../utils';

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

  protected write(content: string) {
    for (const writePath of this.writePaths) {
      const filePath = resolve(writePath, this.fileName);

      writeFileSync(filePath, content);
      execSync(`prettier ${filePath} --write`);
    }
  }
}
