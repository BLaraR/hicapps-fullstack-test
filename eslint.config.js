module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      quotes: ['error', 'double'],
      indent: ['error', 2],
      'max-len': ['error', { code: 120 }],
    },
  }
];
