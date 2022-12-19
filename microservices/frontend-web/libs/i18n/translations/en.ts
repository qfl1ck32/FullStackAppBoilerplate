export type Translations = {
  auth: {
    register: 'Register';
    login: 'Login';
    forgotPassword: 'Forgot your pasword?';
    alreadyHaveAnAccount: 'Already have an account?';
    doNotHaveAnAccountYet: "Don't have an account?";
    show: 'Show';
    hide: 'Hide';
    welcome: 'Welcome, {{ name }}!';
  };
  general: {
    firstName: 'First name';
    lastName: 'Last name';
    email: 'Email';
    password: 'Password';
    username: 'Username';
    usernameOrEmail: 'Username or e-mail';
    welcome: 'Welcome';
  };
  exceptions: {
    EXPIRED_JWT: 'Expired jwt';
    INVALID_JWT: 'Invalid jwt';
    USER_NOT_FOUND: 'User not found';
    WRONG_PASSWORD: 'Wrong password';
    USER_NOT_AUTHORIZED: 'User not authorized';
    USER_ALREADY_EXISTS: 'User already exists';
  };
};
