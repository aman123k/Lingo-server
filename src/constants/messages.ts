export const ERROR_MESSAGES = {
  GOOGLE_AUTH_SERVER_ERROR:
    "Server error during Google authentication. Please try again later.",
  USER_EXISTS: "User already exists. Please login with",
  USER_UNKNOWN_ERROR: "An unexpected error occurred while fetching user info.",
  USER_UNAUTHORIZED: "Unauthorized request. Please log in again.",
  TOKEN_INVALID: "Invalid authentication token.",
  SURVEY_UPDATE_ERROR:
    "An error occurred while updating survey data. Please try again.",
  REGISTRATION_FAILED: "Registration failed. Please try again later.",
  USER_CREATION_ERROR:
    "An error occurred while creating your account. Please try again.",
  USER_LOGIN_ERROR:
    "An error occurred while login to your account. Please try again.",
  USER_NOT_FOUND: "User does't exist. Please register",
  INVALID_PASSWORD: "Invalid password",
  AUTH_REQUEST_ERROR: "Too many requests from this IP, please try again later.",
  GITHUB_AUTH_SERVER_ERROR:
    "Server error during Github authentication. Please try again later.",

  //   INVALID_USER_ID: "Invalid or malformed user ID.",
  //   USER_FETCH_FAILED: "Failed to fetch user information.",
  //   DATABASE_ERROR: "Database error while retrieving user data.",
  //   TOKEN_EXPIRED: "Authentication token has expired.",
  //   PERMISSION_DENIED: "You do not have permission to access this user info.",
  //   NETWORK_ERROR: "Network error occurred while fetching user data.",
};

export const SUCCESS_MESSAGES = {
  GOOGLE_LOGIN_SUCCESS: "You have successfully logged in with Google!",
  GITHUB_LOGIN_SUCCESS: "You have successfully logged in with Github!",
  REGISTER_SUCCESS: "You have registered successfully!",
  SURVEY_COMPLETED_SUCCESS: "Survey completed successfully!",
  LOGIN_SUCCESS: "You have successfully logged in",
};
