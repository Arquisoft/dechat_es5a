const config = require('./protractor.conf').config;

config.capabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: ['--headless', '--no-sandbox']
    }
};

config.chromeDriver = '/usr/bin/chromedriver',

    config.directConnect = true,

    exports.config = config;
