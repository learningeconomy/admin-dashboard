/** @type {import("prettier").Config} */
export default {
    plugins: ['prettier-plugin-astro'],
    printWidth: 100,
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    arrowParens: 'avoid',
    quoteProps: 'preserve',
    overrides: [
        {
            'files': '*.astro',
            'options': { 'parser': 'astro' },
        },
    ],
};
