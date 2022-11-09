import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule } from '@root/database/database.module';
import { PermissionsModule } from '@root/permissions/permissions.module';
import { PermissionsService } from '@root/permissions/permissions.service';
import { UsersModule } from '@root/users/users.module';

import { RequireRoles } from './roles.decorator';
import { Role } from './roles.enum';
import { RolesGuard } from './roles.guard';
import { createMock } from '@golevelup/ts-jest';

// Todo: think how to test?
describe('RolesGuard', () => {
  let reflector: Reflector;
  let permissionsService: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PermissionsModule, DatabaseModule, UsersModule],
    }).compile();

    reflector = module.get(Reflector);
    permissionsService = module.get(PermissionsService);
  });

  it('should be defined', () => {
    expect(new RolesGuard(reflector, permissionsService)).toBeDefined();
  });

  it('should work with roles', async () => {
    // reflector.getAllAndOverride = jest.fn().mockReturnValue([Role.ADMIN]);
    // permissionsService.has = jest.fn().mockReturnValue(true);
    // const guard = new RolesGuard(reflector, permissionsService);
    // const mockExecutionContext = createMock<ExecutionContext>({
    //   getArgs: () => [
    //     null,
    //     {
    //       req: {
    //         user: null,
    //       },
    //     },
    //     null,
    //   ],
    // });
    // console.log(await guard.canActivate(mockExecutionContext));
  });
});
