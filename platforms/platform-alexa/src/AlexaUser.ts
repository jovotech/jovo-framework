import { JovoUser } from '@jovotech/framework';
import { Alexa } from './Alexa';

import { AlexaRequest } from './AlexaRequest';
import { ProfileProperty, sendCustomerProfileApiRequest } from './api';
import {
  AbsoluteReminder,
  RelativeReminder,
  ReminderListResponse,
  ReminderResponse,
  setReminder,
  getAllReminders,
  getReminder,
  updateReminder,
  deleteReminder,
} from './api/ReminderApi';

export class AlexaUser extends JovoUser<Alexa> {
  constructor(jovo: Alexa) {
    super(jovo);
  }

  get id(): string {
    return this.jovo.$request.session?.user?.userId || 'AlexaUser';
  }

  async getEmail(): Promise<string | undefined> {
    const request: AlexaRequest = this.jovo.$request;
    const email: string = await sendCustomerProfileApiRequest(
      ProfileProperty.EMAIL,
      request.getApiEndpoint(),
      request.getApiAccessToken(),
    );
    return email;
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
