// Karma configuration
// Generated on Sun Feb 18 2018 11:29:12 GMT+0100 (Paris, Madrid)

var webpackConfig = require('./webpack.conf/tests.js');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha','chai', 'sinon'],

    webpack: webpackConfig,

    client: {
      mocha: {
        reporter: 'html'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'tastes/index.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tastes/index.spec.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress', 'coverage-istanbul', 'coveralls'],
    reporters: ['progress', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly'],
      dir: './coverage',
      fixWebpackSourcePaths: true
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS', 'Opera', 'IE'],
    browsers: ['Chrome'],

    customLaunchers: {
      ChromeHeadlessWithoutSecurity : {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security']
      },
      ChromeWithoutSecurity : {
        base: 'Chromium',
        flags: ['--disable-web-security']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
