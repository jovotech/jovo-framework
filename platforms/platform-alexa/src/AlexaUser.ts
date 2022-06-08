import { JovoUser } from '@jovotech/framework';
import { Alexa } from './Alexa';

import { AlexaRequest } from './AlexaRequest';
import { CustomerProfileApiResponse, ProfileProperty, sendCustomerProfileApiRequest } from './api';
import {
  AbsoluteReminder,
  deleteReminder,
  getAllReminders,
  getReminder,
  RelativeReminder,
  ReminderListResponse,
  ReminderResponse,
  setReminder,
  updateReminder,
} from './api/ReminderApi';

export class AlexaUser extends JovoUser<Alexa> {
  constructor(jovo: Alexa) {
    super(jovo);
  }

  get id(): string | undefined {
    return this.jovo.$request.getUserId();
  }

  get accessToken(): string | undefined {
    return this.jovo.$request.session?.user.accessToken;
  }

  async getEmail(): Promise<string | undefined> {
    return await this.getProfileProperty(ProfileProperty.EMAIL);
  }

  async getMobileNumber(): Promise<{ countryCode: string; mobileNumber: string } | undefined> {
    return await this.getProfileProperty(ProfileProperty.MOBILE_NUMBER);
  }

  async getName(): Promise<string | undefined> {
    return await this.getProfileProperty(ProfileProperty.NAME);
  }

  async getGivenName(): Promise<string | undefined> {
    return await this.getProfileProperty(ProfileProperty.GIVEN_NAME);
  }

  private async getProfileProperty<PROPERTY extends ProfileProperty>(
    property: PROPERTY,
  ): Promise<CustomerProfileApiResponse<PROPERTY> | undefined> {
    const request: AlexaRequest = this.jovo.$request;
    return sendCustomerProfileApiRequest(
      property,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
  }

  async setReminder(reminder: AbsoluteReminder | RelativeReminder): Promise<ReminderResponse> {
    const request: AlexaRequest = this.jovo.$request;
    return setReminder(reminder, request.getApiEndpoint(), request.getApiAccessToken());
  }

  async updateReminder(
    alertToken: string,
    reminder: AbsoluteReminder | RelativeReminder,
  ): Promise<ReminderResponse> {
    const request: AlexaRequest = this.jovo.$request;
    return updateReminder(
      alertToken,
      reminder,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
  }

  async deleteReminder(alertToken: string): Promise<ReminderResponse> {
    const request: AlexaRequest = this.jovo.$request;
    return deleteReminder(alertToken, request.getApiEndpoint(), request.getApiAccessToken());
  }

  async getAllReminders(): Promise<ReminderListResponse> {
    const request: AlexaRequest = this.jovo.$request;
    return getAllReminders(request.getApiEndpoint(), request.getApiAccessToken());
  }

  async getReminder(alertToken: string): Promise<ReminderResponse> {
    const request: AlexaRequest = this.jovo.$request;
    return getReminder(alertToken, request.getApiEndpoint(), request.getApiAccessToken());
  }
}
