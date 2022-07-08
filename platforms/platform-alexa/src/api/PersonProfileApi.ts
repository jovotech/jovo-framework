import { JovoError } from '@jovotech/framework';
import { AlexaApiError, AlexaApiErrorCode, AlexaApiOptions, sendApiRequest } from './AlexaApi';

export enum PersonProfileProperty {
  NAME = 'name',
  GIVEN_NAME = 'givenName',
  MOBILE_NUMBER = 'mobileNumber',
}

/**
 * Determines the response type for the Person Profile API.
 * For mobileNumber, returns the mobileNumber with the respective countryCode.
 * Otherwise just returns the result string.
 */
export type PersonProfileApiResponse<PROPERTY extends PersonProfileProperty> =
  PROPERTY extends PersonProfileProperty.MOBILE_NUMBER
    ? { [PersonProfileProperty.MOBILE_NUMBER]: string; countryCode: string }
    : string;

/**
 * Sends a request to Amazon's Person Profile API for getting profile information
 * @param profileProperty - The profile property which determines the final API endpoint url
 * @param apiEndpoint - API endpoint, differs on the geographic location of the skill
 * @param permissionToken - Token to authorize the request
 * @see {@link https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-recognized-speaker-contact-information.html Request Recognized Speaker Contact Information}
 */
export async function sendPersonProfileApiRequest<PROPERTY extends PersonProfileProperty>(
  profileProperty: PROPERTY,
  apiEndpoint: string,
  permissionToken: string,
): Promise<PersonProfileApiResponse<PROPERTY>> {
  const options: AlexaApiOptions = {
    endpoint: apiEndpoint,
    path: `/v2/persons/~current/profile/${profileProperty}`,
    permissionToken,
  };

  try {
    const response = await sendApiRequest<PersonProfileApiResponse<PROPERTY>>(options);
    return response.data;
  } catch (error) {
    if (error.isAxiosError) {
      const { message, code } = error.response.data;
      let errorCode: AlexaApiErrorCode = AlexaApiErrorCode.ERROR;

      // User needs to grant access in app
      if (
        message === 'The authentication token is not valid.' ||
        message === 'Access to this resource has not yet been requested.' ||
        (code === 'ACCESS_DENIED' && message === 'Access denied with reason: ACCESS_NOT_REQUESTED')
      ) {
        errorCode = AlexaApiErrorCode.NO_USER_PERMISSION;
      }

      // Dev needs to set correct permissions in ASK console
      if (
        message === 'Access to this resource cannot be requested.' ||
        (code === 'ACCESS_DENIED' && message === 'Access denied with reason: FORBIDDEN')
      ) {
        errorCode = AlexaApiErrorCode.NO_SKILL_PERMISSION;
      }

      throw new AlexaApiError({ message, code: errorCode });
    }

    throw new JovoError({ message: error.message });
  }
}
