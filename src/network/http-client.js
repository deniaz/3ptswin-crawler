// @flow

import fetch from 'node-fetch';

export class HttpClient {
    async get (url: string): Promise<any> {
        try {
            const response = await fetch(url);
            return response.text();
        } catch (e) {
            console.log(e);
        }
    }
}
