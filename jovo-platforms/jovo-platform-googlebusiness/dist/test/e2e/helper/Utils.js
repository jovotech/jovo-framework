"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.PATH_TO_DB_DIR = './test/db';
function clearDbFolder() {
    const files = fs.readdirSync(exports.PATH_TO_DB_DIR);
    files.forEach((file) => {
        fs.unlinkSync(path.join(exports.PATH_TO_DB_DIR, file));
    });
}
exports.clearDbFolder = clearDbFolder;
/**
 * The Lindenbaum platform stores session data in the DB.
 *
 * This helper function overwrites the db.json file and adds the session data
 * for the parsed user.
 * @param userId the user for which to set the session data
 * @param data the session data
 */
// tslint:disable-next-line:no-any
function setDbSessionData(userId, data) {
    const dbJson = {
        userData: {
            data: {},
            session: {
                $data: data,
                lastUpdatedAt: new Date().toISOString(),
            },
        },
    };
    const stringifiedData = JSON.stringify(dbJson, null, '\t');
    fs.writeFileSync(`${exports.PATH_TO_DB_DIR}/${userId}.json`, stringifiedData);
}
exports.setDbSessionData = setDbSessionData;
//# sourceMappingURL=Utils.js.map