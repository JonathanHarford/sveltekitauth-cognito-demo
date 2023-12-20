/**
 * @file Cognito.ts
 * File containing the Cognito service
 */
import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from '$env/static/private';
import { AuthenticationDetails, CognitoRefreshToken, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
export type CognitoUserSessionType = CognitoUserSession;
const CONFIGS = {
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID
};
// Create a new Cognito User Pool
const Pool = new CognitoUserPool(CONFIGS);
// Wrapper function to create a new Cognito User from the User Pool
const User = (Username: string): CognitoUser => new CognitoUser({ Username, Pool });
/**
 * Login to Cognito User Pool using the provided credentials.
 * This will return the session data at the time of login.
 *
 * @param Username - Email address of the user to login
 * @param Password - Password of the user to login
 * @returns - Promise with the result of the login
 */
export const getSession = (Username: string, Password: string): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) =>
    User(Username).authenticateUser(new AuthenticationDetails({ Username, Password }), {
      onSuccess: resolve,
      onFailure: reject,
    })
  );
};
/**
 * Refresh the access token of the provided user.
 * We will use this method to refresh the access token from our axios interceptor
 * 
 * @param sessionData - Session data of the user with the refresh token
 * @returns - Promise with the new user object with tokens and expiration date
 */
export const refreshAccessToken = async (sessionData: {
  refreshToken: string;
}): Promise<CognitoUserSession> => {
  const cognitoUser = Pool.getCurrentUser();
  // Check if the user is logged in
  if (!cognitoUser) {
    throw new Error('No user found');
  }
  // Refresh the session
  const RefreshToken = new CognitoRefreshToken({
    RefreshToken: sessionData.refreshToken,
  });
  return new Promise<CognitoUserSession>((resolve) => {
    cognitoUser.refreshSession(RefreshToken, (_resp, session: CognitoUserSession) => {
      resolve(session);
    });
  });
}