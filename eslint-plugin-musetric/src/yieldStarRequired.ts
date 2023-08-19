import { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'requireStar' | 'typedImport';

export const yieldStarRequired: TSESLint.RuleModule<MessageIds> = {
    defaultOptions: [],
    meta: {
        type: 'problem',
        messages: {
            requireStar: 'Use yield* instead yield. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*',
            typedImport: 'Use typed-redux-saga instead redux-saga/effects',
        },
        schema: [],
    },
    create: (context) => ({
        YieldExpression: (node) => {
            if (node.delegate) return;
            return context.report({
                node,
                messageId: 'requireStar',
            });
        },
        ImportDeclaration: (node) => {
            if (node.source.value !== 'redux-saga/effects') return;
            return context.report({
                node: node.source,
                messageId: 'typedImport',
            });
        }
    }),
};
