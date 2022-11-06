import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthMiddleware } from './auth.middleware';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

// TODO: test
describe('AuthMiddleware', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(
      new AuthMiddleware(authService, jwtService, configService),
    ).toBeDefined();
  });
});
