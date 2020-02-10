import uuid = require('uuid');
import {
  CoreComponent,
  CoreResponse,
  Data,
  JovoWebClient,
  RequestEvents,
  ResponseEvents,
  SessionData,
  StoreEvents,
  UserData,
} from '..';

const USER_DATA_STORAGE_KEY = 'user';

export class Store extends CoreComponent {
  readonly name = 'Store';
  data: Data = {};
  user!: UserData;
  session!: SessionData;

  constructor(protected readonly $client: JovoWebClient) {
    super($client);
    this.fillUserData();
    this.startNewSession();

    $client.on(RequestEvents.Success, this.onResponse.bind(this));
    $client.on(ResponseEvents.MaxRepromptsReached, this.onMaxRepromptsReached.bind(this));
  }

  startNewSession(isForced = false) {
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

  private onResponse(data: CoreResponse) {
    if (data.session.end) {
      this.startNewSession();
    } else {
      this.session.new = false;
      this.session.data = data.session.data;
    }

    if (data.user) {
      this.user.data = data.user.data;
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
