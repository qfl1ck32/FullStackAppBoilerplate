export class CreateUserInput {
  firstName?: string;
  lastName?: string;
  username?: string;

  email: string;
  password: string;

  requiresEmailValidation?: boolean;
}
