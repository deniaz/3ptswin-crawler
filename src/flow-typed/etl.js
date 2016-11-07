export type ExtractMessage = string;

export type TransformMessage = {};

export type LoadMessage = {
    type: 'node' | 'relationship',
    content: NodeLoadMessage | RelationshipLoadMessage
};

export type NodeLoadMessage = {
    label: string,
    properties: object,
    relationships: any
};

export type RelationshipLoadMessage = {
    subject: { label: string, id: any },
    object: { label: string, id: any },
    relationship: { type: string, properties: { object } }
};

export type DispatchMessage = {
    type: 'extract' | 'transform' | 'load',
    content: ExtractMessage | TransformMessage | LoadMessage
};
