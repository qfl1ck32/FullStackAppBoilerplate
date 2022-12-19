import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const getName = (className: string) => {
  const name = className.match(/[A-Z][a-z]+/g) as RegExpMatchArray;

  name.pop();

  return name;
};

const getCode = (className: string) => {
  const name = getName(className);

  return name.map((subname) => subname.toUpperCase()).join('_');
};

const main = async () => {
  const exceptionsRegex = '../microservices/backend/**/*.exception.ts';
  const exceptionCodesFileName = './exception-codes.ts';
  const exceptionCodesTranslationsFileName = './exceptions.i18n.json';

  const codes = [] as string[];

  // TODO: why not just import the file & call .getCode() ?
  glob(exceptionsRegex, (_, matches) => {
    for (const match of matches) {
      const fileContent = readFileSync(match, 'utf-8');

      const classNameRegex = new RegExp(
        'export class (.*) extends Exception {',
      );

      const customCodeRegex = new RegExp("getCode[(][)] {\n    return '(.*)';");

      const className = classNameRegex.exec(fileContent)?.[1];
      const code = customCodeRegex.exec(fileContent)?.[1];

      codes.push(code ?? getCode(className as string));
    }

    const exceptionCodesText = `export enum ExceptionCode {
        ${codes
          .map((code) => {
            return `${code} = "${code}"`;
          })
          .join(',\n\t')}
      }`;

    console.log(exceptionCodesText);

    //     writeFileSync(exceptionCodesFileName, exceptionCodesText);

    //     execSync(`prettier ${exceptionCodesFileName} --write`);

    //     const exceptionCodesTranslationsText = `{
    //       ${codes
    //         .map((code) => {
    //           const name = code
    //             .split('_')
    //             .map((subname) => subname.toLowerCase())
    //             .join(' ');
    //           return `"${code}": "${name[0].toUpperCase() + name.slice(1)}"`;
    //         })
    //         .join(',\n\t')}
    // }`;

    //     writeFileSync(
    //       exceptionCodesTranslationsFileName,
    //       exceptionCodesTranslationsText,
    //     );

    //     execSync(`prettier ${exceptionCodesTranslationsFileName} --write`);

    console.log('Done');
  });

  return;
};

main();
