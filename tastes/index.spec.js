// requires all tests in `project/tastes/test/**/*.spec.js`
const tests = require.context('./tests/', true, /\.spec\.js$/);

tests.keys().forEach(tests);

// requires all components in `project/src/**/*.js`
const components = require.context('../src/', true, /index\.js$/);

components.keys().forEach(components);
