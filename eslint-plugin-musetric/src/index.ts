import { recommended } from './eslintrc';
import { yieldStarRequired } from './yieldStarRequired';
import { TSESLint } from '@typescript-eslint/utils';

export const rules = {
	yieldStarRequired,
} satisfies Record<string, TSESLint.RuleModule<string>>;

export const configs = {
	recommended,
};
