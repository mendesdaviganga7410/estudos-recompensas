import js from '@eslint/js';
import globals from 'globals';
import { parser as tsParser } from 'typescript-eslint';

export default [
    js.configs.recommended,
    /* ───── Non‑module scripts (shared globals architecture) ───── */
    {
        files: ['src/**/*.js', 'src/**/*.ts'],
        ignores: ['src/core/firebase/**/*.js', 'src/core/firebase/**/*.ts', 'src/types/**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            parser: tsParser,
            globals: {
                ...globals.browser,
                Cropper: 'readonly',
            },
        },
        rules: {
            'no-undef': 'off',
            'no-unused-vars': ['warn', { args: 'none', vars: 'local' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-redeclare': 'off',
        },
    },
    /* ───── Firebase ES modules ───── */
    {
        files: ['src/core/firebase/**/*.js', 'src/core/firebase/**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tsParser,
            globals: {
                ...globals.browser,
                Cropper: 'readonly',
            },
        },
        rules: {
            'no-undef': 'error',
            'no-unused-vars': ['error', { args: 'none' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-redeclare': 'off',
        },
    },
];
