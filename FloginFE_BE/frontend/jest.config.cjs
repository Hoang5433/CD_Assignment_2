// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    // Bỏ qua tất cả node_modules, ngoại trừ các thư mục sau dấu '?!'
    "node_modules/(?!(axios|zod|sonner|react-router-dom|react-router)/)",
  ],
  moduleNameMapping: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
