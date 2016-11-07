// @flow

import fetch from 'node-fetch';

export const crawl = async (url: string): Promise<any> => {
    try {
        const response = await fetch(url);
        return response.text();
    } catch (e) {
        console.log('Crawling failed.');
    }
};
