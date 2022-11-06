import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@root/database/database.module';
import { ObjectId } from '@root/database/database.types';
import { AddPermissionInput } from './dto/add-permission.input';
import { PermissionsModule } from './permissions.module';
import { PermissionsService } from './permissions.service';

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PermissionsModule, DatabaseModule],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('add()', async () => {
    const input = {
      userId: new ObjectId(),
      permission: 'permission',
      domain: 'app',
    } as AddPermissionInput;

    await service.add(input);

    let permissions = await service.find({});

    expect(permissions).toHaveLength(1);

    expect(permissions[0]).toMatchObject(input);

    await service.add(input);

    permissions = await service.find(input);

    // Not inserting duplicates
    expect(permissions).toHaveLength(1);
  });

  test('remove()', async () => {
    const input = {
      userId: new ObjectId(),
      permission: 'permission',
      domain: 'app',
    } as AddPermissionInput;

    await service.add(input);

    await service.remove(input);

    let permissions = await service.find({});

    expect(permissions).toHaveLength(0);

    await service.remove(input);

    permissions = await service.find({});

    expect(permissions).toHaveLength(0);
  });

  test('has()', async () => {
    const input = {
      userId: new ObjectId(),
      permission: 'permission',
      domain: 'app',
    } as AddPermissionInput;

    const anotherPermission = 'another-permission';

    await service.add(input);

    let has = await service.has(input);

    expect(has).toBe(true);

    has = await service.has({
      ...input,
      userId: new ObjectId(),
    });

    expect(has).toBe(false);

    has = await service.has({
      ...input,
      permission: anotherPermission,
    });

    expect(has).toBe(false);

    has = await service.has({
      ...input,

      domain: 'another-domain',
    });

    expect(has).toBe(false);

    has = await service.has({
      ...input,

      permission: [input.permission, anotherPermission],
    });

    expect(has).toBe(true);

    await service.add({
      ...input,

      permission: anotherPermission,
    });

    has = await service.has({
      ...input,

      permission: ['non-existing', anotherPermission],
    });

    expect(has).toBe(true);
  });

  test('find()', async () => {
    const input = {
      userId: new ObjectId(),
      permission: 'permission',
      domain: 'app',
    } as AddPermissionInput;

    const anotherInput = {
      userId: new ObjectId(),
      permission: 'permission',
      domain: 'app',
    } as AddPermissionInput;

    const anotherPermission = 'another-permission';

    await service.add(input);

    await service.add({
      ...input,

      permission: anotherPermission,
    });

    await service.add(anotherInput);

    let result = await service.find({
      userId: input.userId,
    });

    expect(result).toHaveLength(2);

    result = await service.find({
      permission: input.permission,
    });

    expect(result).toHaveLength(2);

    result = await service.find({
      permission: anotherPermission,
    });

    expect(result).toHaveLength(1);
  });
});
