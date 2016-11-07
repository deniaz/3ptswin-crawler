// @flow

import neo4j from 'neo4j';
import { error, log } from '../utils';
import { dispatch } from './dispatcher';
import { createLoad } from './factory';

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

    log(`Successfully loaded ${message.label} '${message.properties.name}'.`);

    if (shouldLoadRelationships(message)) {
        message.relationships.map((relation) => {
            const subject = {
                label: message.label,
                properties: {
                    id: message.properties.id,
                }
            };
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

function createPropertyString (properties: Object): string {
    const keys = Object.keys(properties);
    const propertyList = keys.reduce((pre, cur) => {
        pre.push(`${cur}: '${properties[cur]}'`);

        return pre;
    }, []);
    return propertyList.join(', ');
}

const loadNode = (message: NodeLoadMessage) => {
    const properties = createPropertyString(message.properties);

    const query = `MERGE (c:${message.label} { ${properties} })`;

    db.cypher({
        query: query,
        lean: true
    }, (err, results) => { handleCallback(err, results, message) });
}

const loadRelationship = (message: RelationshipLoadMessage) => {
    const { subject, object, relationship } = message;
    const query = [
        `MATCH (s:${subject.label} { ${createPropertyString(subject.properties)} }), `,
        `(o:${object.label} { ${createPropertyString(object.properties)} }) `,
    ];

    query.push(
        relationship.properties
        ? `MERGE (s)-[:${relationship.type} { ${createPropertyString(relationship.properties)} }]->(o);`
        : `MERGE (s)-[:${relationship.type}]->(o);`
    )

    db.cypher({
        query: query.join(''),
        lean: true
    }, (err, results) => {
        if (err) {
            throw err;
        }

        log(`Successfully loaded ${relationship.type}.`);
    });
}

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
