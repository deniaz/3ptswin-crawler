#!/usr/bin/env node

import { Importer } from '../src/importer';
import { SuperLeagueExtractor } from '../src/extractor'
import { Neo4jLoader } from '../src/loader';

const importer = new Importer(
    new SuperLeagueExtractor('2015'),
    new Neo4jLoader()
);

importer.start();
