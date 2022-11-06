import { execSync } from "child_process";
import { fstat, readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const getCode = (className: string) => {
  const name = className.match(/[A-Z][a-z]+/g) as RegExpMatchArray;

  name.pop();

  return name.map((subname) => subname.toUpperCase()).join("_");
};

const main = async () => {
  const exceptionsRegex = "../backend/**/*.exception.ts";
  const exceptionCodesFileName = "../exception-codes.ts";

  const codes = [] as string[];

  glob(exceptionsRegex, (_, matches) => {
    for (const match of matches) {
      const fileContent = readFileSync(match, "utf-8");

      const classNameRegex = new RegExp("export class (.*) extends Exception {");
      const customCodeRegex = new RegExp("getCode[(][)] {\n    return '(.*)';");

      const className = classNameRegex.exec(fileContent)?.[1];
      const code = customCodeRegex.exec(fileContent)?.[1];

      codes.push(code ?? getCode(className as string));
    }

    const text = `export enum ExceptionCode {
        ${codes
          .map((code) => {
            return `${code} = "${code}"`;
          })
          .join(",\n\t")}
      }`;

    writeFileSync(exceptionCodesFileName, text);

    execSync(`prettier ${exceptionCodesFileName} --write`);

    console.log("Done");
  });

  return;
};

main();
