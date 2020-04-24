import * as fs from 'fs';
import * as path from 'path';

export const PATH_TO_DB_DIR = './test/db';

export function clearDbFolder() {
  const files = fs.readdirSync(PATH_TO_DB_DIR);

  files.forEach((file) => {
    fs.unlinkSync(path.join(PATH_TO_DB_DIR, file));
  });
}

/**
 * The Lindenbaum platform stores session data in the DB.
 *
 * This helper function overwrites the db.json file and adds the session data
 * for the parsed user.
 * @param userId the user for which to set the session data
 * @param data the session data
 */
// tslint:disable-next-line:no-any
export function setDbSessionData(userId: string, data: any) {
  const dbJson = {
    userData: {
      data: {},
      session: {
        lastUpdatedAt: new Date().toISOString(),
        $data: data,
      },
    },
  };
  const stringifiedData = JSON.stringify(dbJson, null, '\t');
  fs.writeFileSync(`${PATH_TO_DB_DIR}/${userId}.json`, stringifiedData);
}
