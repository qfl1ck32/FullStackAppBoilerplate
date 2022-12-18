export enum Domain {
  app = 'app',
}

export enum Role {
  admin = 'admin',
  end_user = 'end_user',
}

export interface PermissionsModuleForRootArgs {
  roleRef?: any;
}
