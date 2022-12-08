import { Injectable } from '@nestjs/common';
import { TypeMetadataStorage } from '@nestjs/graphql';
import { MetadataByTargetCollection } from '@nestjs/graphql/dist/schema-builder/collections';

import {
  IS_ALPHA,
  IS_ARRAY,
  IS_EMAIL,
  IS_IN,
  MATCHES,
  MAX_LENGTH,
  MIN_LENGTH,
  getMetadataStorage,
} from 'class-validator';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { writeFileSync } from 'fs';

@Injectable()
export class YupSchemaGeneratorService {
  private validationMetadatas: Record<string, ValidationMetadata[]>;

  private constraintMetadatasArray: ConstraintMetadata[];

  private graphqlFieldsStorage: MetadataByTargetCollection;

  private schemas: Record<string, string>;

  private writePaths: string[];

  async init() {
    this.validationMetadatas = {};

    const metadataStorage = getMetadataStorage();

    const validationMetadatasArr = (metadataStorage as any)
      .validationMetadatas as ValidationMetadata[];

    for (const metadata of validationMetadatasArr) {
      const targetName = (metadata.target as any).name;

      if (!this.validationMetadatas[targetName]) {
        this.validationMetadatas[targetName] = [];
      }

      this.validationMetadatas[targetName].push(metadata);

      this.graphqlFieldsStorage = (TypeMetadataStorage as any)
        .metadataByTargetCollection as MetadataByTargetCollection;
    }

    this.constraintMetadatasArray = (
      metadataStorage as any
    ).constraintMetadatas;

    this.schemas = {};

    this.writePaths = ['../frontend-web/src/yup/schema.ts'];
  }

  async generateSchema() {
    const targets = this.graphqlFieldsStorage.all.inputType.map(
      (item) => item.target,
    );

    await Promise.all(
      targets.map((target) => this.generateSchemaForClass(target)),
    );
  }

  async generateSchemaForClass(InputClass: Function) {
    const finalYupFields = [];

    const name = InputClass.name;

    const validations = this.validationMetadatas[name];

    const fields = this.graphqlFieldsStorage.get(InputClass).fields.getAll();

    for (const field of fields) {
      const type = field.typeFn();

      const inputName = (type as any).name.toLowerCase();

      let yupField = '';

      if (type.toString().includes('class')) {
        yupField = `${(type as any).name}Schema`;
      } else {
        yupField = `yup.${inputName}()`;
      }

      const fieldValidations =
        validations?.filter(
          (validation) => validation.propertyName === field.name,
        ) || [];

      let shouldBeArray = false;

      for (const validation of fieldValidations) {
        const constraint = this.constraintMetadatasArray.find(
          (c) => c.target === validation.constraintCls,
        );

        const constraintName = constraint.name;

        const constraints = validation.constraints;

        switch (constraintName) {
          case MIN_LENGTH: {
            yupField += `.min(${constraints[0]})`;
            break;
          }

          case MAX_LENGTH: {
            yupField += `.max(${constraints[0]})`;
            break;
          }

          case IS_EMAIL: {
            yupField += `.email()`;
            break;
          }

          case IS_IN: {
            yupField += `.oneOf(${JSON.stringify(constraints[0])})`;
            break;
          }

          case IS_ARRAY: {
            shouldBeArray = true;
            break;
          }

          case IS_ALPHA: {
            yupField += `.matches(/[A-Za-z]/)`;
            break;
          }

          case MATCHES: {
            yupField += `.matches(${constraints[0]})`;
            break;
          }
        }
      }

      if (shouldBeArray) {
        yupField = `yup.array().of(${yupField})`;
      }

      yupField = `${field.name}: ${yupField}.${
        Boolean(field.options.nullable) ? 'notRequired' : 'required'
      }()`;

      finalYupFields.push(yupField);
    }

    const result = `yup.object().shape({
  ${finalYupFields.join(',\n  ')}
})`;

    this.schemas[name] = result;
  }

  async writeSchema() {
    const schema = Object.keys(this.schemas)
      .map((key) => `export const ${key}Schema = ${this.schemas[key]}`)
      .join('\n\n');

    const fileContent = `import { yup } from '@libs/yup/yup.service';    ;

${schema}`;

    for (const path of this.writePaths) {
      writeFileSync(path, fileContent);
    }
  }
}
