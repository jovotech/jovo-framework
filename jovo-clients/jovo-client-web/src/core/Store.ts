import uuid = require('uuid');
import { RequestEvents, ResponseEvents, SessionData, StoreEvents, UserData, WebAssistantResponse } from '..';
import { JovoWebClient } from '../JovoWebClient';

const USER_DATA_STORAGE_KEY = 'user';

export class Store {
  data: Record<string, any> = {};
  user!: UserData;
  session!: SessionData;

  constructor(private readonly $client: JovoWebClient) {
    this.fillUserData();
    this.startNewSession();

    $client.on(RequestEvents.Success, this.onResponse.bind(this));
    $client.on(ResponseEvents.MaxRepromptsReached, this.onMaxRepromptsReached.bind(this));
  }

  startNewSession(isForced: boolean = false) {
    this.session = {
      data: {},
      id: uuid.v4(),
      new: true,
    };
    this.$client.emit(StoreEvents.NewSession, isForced);
  }

  private onMaxRepromptsReached() {
    this.startNewSession(true);
  }

  private onResponse(data: WebAssistantResponse) {
    if (data.response.shouldEndSession) {
      this.startNewSession();
    } else {
      this.session.new = false;
      if (data.sessionData) {
        this.session.data = data.sessionData;
      }
    }

    if (data.userData) {
      this.user.data = data.userData;
      this.saveUser();
    }
  }

  private fillUserData() {
    const user = JSON.parse(localStorage.getItem(USER_DATA_STORAGE_KEY) || '{}');

    if (!user.id) {
      user.id = uuid.v4();
    }

    if (!user.data) {
      user.data = {};
    }

    this.user = user;
    this.saveUser();
  }

  private saveUser() {
    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(this.user));
  }
}
