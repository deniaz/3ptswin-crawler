// @flow

import { SuperLeagueExtractor } from './extractor'
import { Neo4jLoader } from './loader';

export class Importer {
    extractor: SuperLeagueExtractor;
    loader: Neo4jLoader;

    constructor (extractor: any, loader: any) {
        this.extractor = extractor;
        this.loader = loader;
    }

    async start () {
        const crawled = await this.extractor.extract();
        // const parsed = await this.transformer.transform(crawled);
        const loaded = await this.loader.load(crawled);
    }
}
