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
    successfullyRegistered: 'You have succesfully created your account. Check your e-mail for confirmation.';
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
    WRONG_PASSWORD: 'Wrong password';
    USER_NOT_AUTHORIZED: 'You are not authorized';
    USER_ALREADY_EXISTS: 'The user already exists';
    USER_NOT_FOUND: 'The user {{ usernameOrEmail }} was not found';
  };
};
