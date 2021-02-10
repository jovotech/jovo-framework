/// <reference types="node" />
import { RequestOptions } from 'https';
export declare class Util {
    /**
     * Console log helper
     *
     * Prints the file and line number where it has been called.
     * @param {number} pathDepth
     */
    static consoleLog(pathDepth?: number): void;
    /**
     * Creates random string of length 7
     */
    static randomStr(length?: number): string;
    /**
     * Async delay helper
     * @param delayInMilliseconds
     */
    static delay(delayInMilliseconds: number): Promise<unknown>;
    /**
     * Returns random in a given range.
     * @param min
     * @param max
     */
    static randomNumber(min: number, max: number): number;
    /**
     * Post https
     * @param options
     * @param payload
     */
    static httpsPost<T>(options: RequestOptions, payload: object): Promise<T>;
    static httpsPost<T>(url: string, payload: object): Promise<T>;
    /**
     * Post http
     * @param options
     * @param payload
     */
    static httpPost<T>(options: RequestOptions, payload: object): Promise<T>;
    static httpPost<T>(url: string, payload: object): Promise<T>;
}
