const js = require('@eslint/js');
const globals = require('globals');
const {defineConfig} = require('eslint/config');

module.exports = defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {js},

        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.node
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
