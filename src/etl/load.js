// @flow

import neo4j from 'neo4j';
import { error, log } from '../utils';
import { dispatch } from './dispatcher';

import type {
    LoadMessage,
    NodeLoadMessage,
    RelationshipLoadMessage
} from '../flow-typed';

const connection = 'http://neo4j:19017189@localhost:7474'; // Move to .env
const db = new neo4j.GraphDatabase(connection)

function shouldLoadRelationships(message: LoadMessage) {
    return (
        message.relationships &&
        message.relationships.length > 0
    );
}

function handleCallback (err, results, message) {
    if (err) {
        throw err;
    }

    log(`Successfully loaded node with label ${message.label}.`);

    if (shouldLoadRelationships(message)) {
        message.relationships.map((relation) => {
            const subject = {};
            const { object, relationship } = relation;

            dispatch(createLoad(
                'relationship',
                {
                    subject,
                    object,
                    relationship
                }
            ));
        });
    }
}

function createRelation (subject, object, descriptor) {
    db.cypher({
        query: 'MATCH (s:Club { id: {subject_id} }), (o:Competition { id: {object_id} }) CREATE (s)-[:TAKES_PART_IN]->(o)',
        params: {
            subject_id: subject.id,
            object_id: object.id
        },
        lean: true
    }, handleCallback);
}

const loadNode = (message: NodeLoadMessage) => {
    const keys = Object.keys(message.properties);
    const properties = keys.reduce((pre, cur) => {
        pre.push(`${cur}: '${message.properties[cur]}'`);

        return pre;
    }, []);

    const query = `MERGE (c:${message.label} { ${properties.join(', ')} })`;

    log(`Cypher Query: '${query}'`);
    db.cypher({
        query: query,
        lean: true
    }, (err, results) => { handleCallback(err, results, message) });
}

const loadRelationship = (message: RelationshipLoadMessage) => {}

const actions = {
    node: loadNode,
    relationship: loadRelationship,
};

export const load = (message: LoadMessage): void => {
    if (!actions[message.type]) {
        error(`No action found for ${message.type}`);
        return;
    }

    actions[message.type](message.content);
};
