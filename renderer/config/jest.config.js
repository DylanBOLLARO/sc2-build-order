module.exports = {
  rootDir: "../",
  setupFilesAfterEnv: ["./config/jest.setup.js"],
  transform: {
    "\\.js$": ["babel-jest", { configFile: "./renderer/config/.babelrc" }],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules",
  },
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/test/test-utils.js"],
  testEnvironment: "jsdom",
};
