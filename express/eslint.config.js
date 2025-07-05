import js from '@eslint/js';
import globals from 'globals';
import {defineConfig} from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {js},

        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node,
        },

        extends: ['js/recommended'],
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'no-console': 'warn'
        }
    },
    {files: ['**/*.{js,mjs,cjs}'], },
]);
