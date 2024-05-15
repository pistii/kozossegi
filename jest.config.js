module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
      "^.+\\.js$": "babel-jest",
  },
  moduleNameMapper: {
    "^@vue/test-utils": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js"
  }
};
