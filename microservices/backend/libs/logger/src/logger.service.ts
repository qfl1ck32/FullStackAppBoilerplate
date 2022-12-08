import { Injectable } from '@nestjs/common';

import * as chalk from 'chalk';

@Injectable()
export class LoggerService {
  public log(text: string) {
    console.log(text);

    return text;
  }

  private getCalleeInfo() {
    const [className, methodName] = new Error().stack.split(' ')[24].split('.');

    return `[${className} : ${methodName}]`;
  }

  private formatChalkText(text: string) {
    return `[${text}]`;
  }

  private logFormatted(chalkText: string, text: string) {
    return this.log(
      `${this.formatChalkText(chalkText)} ${this.getCalleeInfo()} - ${text}`,
    );
  }

  public info(text: string) {
    return this.logFormatted(chalk.blue('INFO'), text);
  }

  public warning(text: string) {
    return this.logFormatted(chalk.red('WARNING'), text);
  }
}
