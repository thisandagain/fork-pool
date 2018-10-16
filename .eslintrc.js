module.exports = {
    root: true,
    parserOptions: {
        sourceType: 'module',
    },
    env: {
        node: true,
    },
    extends: ['standard', 'prettier'],
    globals: {},
    plugins: [],
    rules: {
        'linebreak-style': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    },
}
