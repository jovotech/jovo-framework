export declare const PATH_TO_DB_DIR = "./test/db";
export declare function clearDbFolder(): void;
/**
 * The Lindenbaum platform stores session data in the DB.
 *
 * This helper function overwrites the db.json file and adds the session data
 * for the parsed user.
 * @param userId the user for which to set the session data
 * @param data the session data
 */
export declare function setDbSessionData(userId: string, data: any): void;
