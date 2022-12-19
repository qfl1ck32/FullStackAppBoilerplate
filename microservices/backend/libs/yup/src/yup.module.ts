import { Global, Module } from '@nestjs/common';

import { YupService } from './yup.service';

@Global()
@Module({
  providers: [YupService],
  exports: [YupService],
})
export class YupModule {
  constructor(protected readonly yupService: YupService) {}

  async onModuleInit() {
    this.yupService.init();
  }
}
