import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';

import { Config } from './defs';

@Injectable()
export class ConfigService extends BaseConfigService<Config> {}
