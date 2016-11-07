// @flow

import type { ExtractMessage, TransformMessage, LoadMessage } from '../flow-typed';

export const createExtract = (url: string): ExtractMessage => {
    return {
        type: 'extract',
        content: url
    };
};

export const createTransform = (type: 'node' | 'relationship', content: Object): TransformMessage => {
    return {
        type: 'transform',
        content,
    };
};

export const createLoad = (type: 'node' | 'relationship', content: Object): LoadMessage => {
    return {
        type: 'load',
        content: {
            type,
            content
        }
    };
};
