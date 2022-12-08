import { Module } from '@nestjs/common';

import { YupSchemaGeneratorService } from './yup-schema-generator.service';

@Module({
  providers: [YupSchemaGeneratorService],
  exports: [YupSchemaGeneratorService],
})
export class YupSchemaGeneratorModule {}
