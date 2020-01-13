import * as crypto from 'crypto';
import * as fs from 'fs';
import _get = require('lodash.get');
import _merge = require('lodash.merge');
import * as path from 'path';
import * as util from 'util';
import { BaseApp, ErrorCode, JovoError } from '..';
import { Data, JovoRequest, JovoResponse, SessionData } from '../Interfaces';
import { TestHost } from '../TestHost';
import { TestSuite } from '../TestSuite';
import { AxiosRequestConfig, HttpService } from './HttpService';
import { Log } from './Log';

const fsunlink = util.promisify(fs.unlink);
const fsexists = util.promisify(fs.exists);
const fsreadFile = util.promisify(fs.readFile);
const fswriteFile = util.promisify(fs.writeFile);

type ConversationTestRuntime = 'app' | 'server';

export interface ConversationConfig {
  userId?: string;
  locale?: string;
  runtime?: ConversationTestRuntime;
  defaultDbDirectory?: string;
  deleteDbOnSessionEnded?: boolean;
  httpOptions?: AxiosRequestConfig;
}

export class Conversation {
  testSuite: TestSuite;
  sessionData: SessionData = {};
  app?: BaseApp;

  $user: {
    $data: Data;
    $metaData: Data;
  } = {
    $data: {},
    $metaData: {},
  };

  config: ConversationConfig = {
    defaultDbDirectory: './db/tests/',
    deleteDbOnSessionEnded: false,
    httpOptions: {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'jovo-test': 'true',
      },
      method: 'POST',
      url: `http://localhost:${process.env.JOVO_PORT || 3000}/webhook`,
    },
    locale: 'en-US',
    runtime: 'server',
    userId: randomUserId(),
  };

  constructor(testSuite: TestSuite, config?: ConversationConfig) {
    this.testSuite = testSuite;
    if (config) {
      this.config = _merge(this.config, config);
    }

    if (this.config.runtime === 'app') {
      try {
        // TODO: cleaner solution required
        process.env.JOVO_CONFIG = process.cwd() + '/src/config.js';
        this.app = require(process.cwd() + '/src/app').app;
      } catch (e) {
        Log.error(e);
      }
    }
  }

  /**
   * Sets userid, timestamp and locale to every request.
   * @param {JovoRequest} req
   */
  applyToRequest(req: JovoRequest): void {
    req.setUserId(this.config.userId || randomUserId());
    if (this.config.locale) {
      req.setLocale(this.config.locale);
    }
  }

  /**
   * Set request user and session data
   * @param req
   */
  async prepare(req: JovoRequest): Promise<JovoRequest> {
    this.applyToRequest(req);
    await this.saveUserData();

    if (req.isNewSession()) {
      this.clearSession();
    } else if (Object.keys(this.sessionData).length > 0) {
      req.setSessionData({ ...this.sessionData });
    }

    return req;
  }

  /**
   * Send request to server or directly to the app, resolve with response.
   * Rejects with Error on failure.
   * @param {JovoRequest} req
   * @returns {Promise<JovoResponse>}
   */
  async send(req: JovoRequest): Promise<JovoResponse> {
    await this.prepare(req);

    if (this.config.runtime === 'server') {
      return this.sendToServer(req);
    } else if (this.config.runtime === 'app') {
      if (!this.app) {
        throw new JovoError(
          `Can't find a valid app object`,
          ErrorCode.ERR,
          'jovo-core',
          `Imported app object can't be found at the default path. Please add a valid object via conversation.app = require(...)`,
        );
      }
      return this.sendToApp(req, this.app);
    }

    throw new JovoError(`Conversation send type not valid. Try 'app' or 'server'`);
  }

  /**
   * Send request to server, resolve with response.
   * Rejects with Error on failure.
   * @param {JovoRequest} req
   * @returns {Promise<JovoResponse>}
   */
  async sendToServer(req: JovoRequest): Promise<JovoResponse> {
    const requestConfig = { ...this.config.httpOptions, data: req.toJSON() };
    const response = await HttpService.request(requestConfig);
    const jovoResponse = this.testSuite.responseBuilder.create(response.data);
    await this.postProcess(jovoResponse);
    return jovoResponse;
  }

  /**
   * Send request directly to app, resolve with response.
   * Rejects with Error on failure.
   * @param {JovoRequest} req
   * @returns {Promise<JovoResponse>}
   */
  async sendToApp(req: JovoRequest, app: BaseApp): Promise<JovoResponse> {
    await this.prepare(req);

    const host = new TestHost(req);
    await app.handle(host);

    if (host.didFail()) {
      throw host.getError();
    } else {
      const response = host.getResponse();
      const jovoResponse = this.testSuite.responseBuilder.create(response);
      await this.postProcess(jovoResponse);
      return jovoResponse;
    }
  }

  /**
   * Perform user/session data housekeeping with response
   * @param jovoResponse
   */
  async postProcess(jovoResponse: JovoResponse): Promise<void> {
    this.sessionData = jovoResponse.getSessionData() || {};
    await this.updateUserData();
    if (this.config.deleteDbOnSessionEnded === true && jovoResponse.hasSessionEnded()) {
      this.clearDb();
    }
  }

  /**
   * Clears session data for this conversation object
   */
  clearSession(): void {
    this.sessionData = {};
  }

  /**
   * Resets conversation. Clears database and session
   * @returns {Promise<void>}
   */
  async reset(): Promise<void> {
    this.clearSession();
    await this.clearDb();
  }

  /**
   * Deletes filedb jsonf ile
   * @returns {Promise<void>}
   */
  async clearDb() {
    const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId + '.json');
    const exists = await fsexists(pathToDb);
    if (!exists) {
      throw new Error(`Can't find ${pathToDb}`);
    }

    await fsunlink(pathToDb);
  }

  /**
   * Saves conversation.$data and conversation.$metaData to file db json.
   * @returns {Promise<void>}
   */
  private async saveUserData() {
    if (Object.keys(this.$user.$data).length > 0 || Object.keys(this.$user.$metaData).length > 0) {
      const userDataObj = {
        userData: {
          data: this.$user.$data,
          metaData: this.$user.$metaData,
        },
      };

      const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId! + '.json');
      await fswriteFile(pathToDb, JSON.stringify(userDataObj, null, '\t'));
    }
  }

  /**
   * Updates conversation.$data and conversation.$meta from file db json.
   * @returns {Promise<void>}
   */
  private async updateUserData() {
    const pathToDb = path.join(this.config.defaultDbDirectory!, this.config.userId! + '.json');
    const dbExists = await fsexists(pathToDb);

    if (dbExists) {
      const fileContent = await fsreadFile(pathToDb);
      const parsedContent = JSON.parse(fileContent.toString());
      this.$user.$data = _get(parsedContent, 'userData.data');
    }
  }
}

/**
 * Generates random user id
 * @returns {string}
 */
function randomUserId(): string {
  return Math.random()
    .toString(36)
    .substring(7);
}

/**
 * Generates projectUserid from the current folder
 * @returns {string}
 */
function projectUserId(): string {
  return `testuser-${crypto
    .createHash('md5')
    .update(__dirname)
    .digest('hex')}`;
}
