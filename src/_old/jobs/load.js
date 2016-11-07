// @flow

import neo4j from 'neo4j';
import { dispatch, error, log } from './utils';

const connection = 'http://neo4j:19017189@localhost:7474'; // Move to .env
const db = new neo4j.GraphDatabase(connection)

function handleCallback (err, results) {
    if (err) {
        dispatch(error({
            message: 'Error while loading node.',
            origin: err
        }));
    }

    dispatch(log({
        message: 'Node loaded.', // Add Name
    }))
}

function createNode (node: any): void {
    db.cypher({
        query: 'MERGE (n: {label} { name: {name} })',
        params: {
            label: node.type,
            name: node.name
        },
        lean: true,
    }, handleCallback);
}

function createRelation (subject, object, descriptor) {
    db.cypher({
        query: '',
        params: {},
        lean: true,
    }, handleCallback);
}

export const load = (object: any): any => {
    createNode(object.node);
    object.relations.map((relation) => {
        createRelation(
            relation.subject,
            relation.object,
            relation.descriptor
        );
    });
};
