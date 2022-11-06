export class CreateUserInput {
  firstName: string;
  lastName: string;

  email: string;
  username?: string;

  password: string;

  requiresEmailValidation?: boolean;
}
