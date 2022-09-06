import { JovoUser } from '@jovotech/framework';
import { Alexa } from './Alexa';

import { AlexaRequest } from './AlexaRequest';
import { CustomerProfileApiResponse, ProfileProperty, sendCustomerProfileApiRequest } from './api';
import {
  PersonProfileApiResponse,
  PersonProfileProperty,
  sendPersonProfileApiRequest,
} from './api/PersonProfileApi';
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
import { getListItem, ListItem } from './api/ListApi';

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

  async getSpeakerName(): Promise<string | undefined> {
    return await this.getPersonProfileProperty(PersonProfileProperty.NAME);
  }

  async getSpeakerGivenName(): Promise<string | undefined> {
    return await this.getPersonProfileProperty(PersonProfileProperty.GIVEN_NAME);
  }

  async getSpeakerMobileNumber(): Promise<
    { countryCode: string; mobileNumber: string } | undefined
  > {
    return await this.getPersonProfileProperty(PersonProfileProperty.MOBILE_NUMBER);
  }

  private async getPersonProfileProperty<PROPERTY extends PersonProfileProperty>(
    property: PROPERTY,
  ): Promise<PersonProfileApiResponse<PROPERTY> | undefined> {
    const request: AlexaRequest = this.jovo.$request;
    return sendPersonProfileApiRequest(
      property,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
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

  getListItem(listId: string, itemId: string): Promise<ListItem[]> {
    const request: AlexaRequest = this.jovo.$request;
    return getListItem(listId, itemId, request.getApiEndpoint(), request.getApiAccessToken());
  }
}
