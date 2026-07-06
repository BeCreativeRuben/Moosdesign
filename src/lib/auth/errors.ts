import { CredentialsSignin } from "next-auth";

export class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials";
}

export class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found";
}

export class OAuthOnlyAccountError extends CredentialsSignin {
  code = "oauth_only";
}

export class InvalidInputError extends CredentialsSignin {
  code = "invalid_input";
}

export class DatabaseUnavailableError extends CredentialsSignin {
  code = "database_unavailable";
}
