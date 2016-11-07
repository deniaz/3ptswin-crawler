// @flow

import fetch from 'node-fetch';
import { error, log } from './logger';


export const crawl = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        return response.text();
    } catch (e) {
        error(`Failed crawling ${url}`);
        error(e);
    }
};
