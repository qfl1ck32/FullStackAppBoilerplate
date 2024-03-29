import { User } from '@root/gql/operations';

export interface AuthServiceState {
  isAuthenticated: boolean;
  isLoading: boolean;

  user: Partial<User> | undefined;
}
