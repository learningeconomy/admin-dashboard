module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        es2020: true,
    },
    extends: ['airbnb-typescript/base', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['prettier', '@typescript-eslint'],
    ignorePatterns: ['.eslintrc.js', 'dist/*'],
    rules: {
        indent: 'off',
        curly: ['warn', 'multi-line'],
        radix: 'off',
        'arrow-parens': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-cycle': 'off',
        'import/no-absolute-path': 'off',
        'no-prototype-builtins': 'off',
        'prettier/prettier': 'error',
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        // TODO - Get team preferences on below rules
        'nonblock-statement-body-position': ['error', 'beside'],
        'no-trailing-spaces': 'off',
        'operator-linebreak': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'warn',
        'max-len': 'off',
        'comma-dangle': 'off',
        'no-console': 'off',
        'function-paren-newline': 'off',
        'implicit-arrow-linebreak': 'off',
        'arrow-body-style': 'off',
        'one-var': 'off',
        'consistent-return': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'object-curly-newline': 'off',
        'no-use-before-define': 'off',
        'no-alert': 'off',
        'class-methods-use-this': 'off',
        'no-fallthrough': 'off',
        camelcase: 'off',
        'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
        '@typescript-eslint/naming-convention': 'off',
        'import/no-extraneous-dependencies': 'off',
    },
};