# next-external-remotes-plugin

This plugin is a fork from Zackary Jackson's ExternalTemplateRemotesPlugin (https://www.npmjs.com/package/external-remotes-plugin)
and it was adapted to work properly with NextFederationPlugin (https://www.npmjs.com/package/@module-federation/nextjs-mf).

**Installation**

Using npm:
```shell
$ npm i next-external-remotes-plugin
```

**Env config**

In your `env` configuration add the URL for remote:

```
APP1="https://url-to-my-mf-in-some-environment"
```

**Host next.config.js**

Add the remote URL to `publicRuntimeConfig`, and the `NextFederationPlugin` and `NextExternalTemplateRemotesPlugin` config as follow:

```js
const NextExternalTemplateRemotesPlugin = require('next-external-remotes-plugin');
    
module.exports = {    
    // ...
    // ...
    webpack(config) {
            config.plugins.push(
                new NextFederationPlugin({
                    name: 'container',
                    remotes: {
                        app1: 'app1@[window.__NEXT_DATA__.runtimeConfig.app1]'
                    },
                    filename: 'static/chunks/container.js',
                    shared: {},
                }),
                new NextExternalTemplateRemotesPlugin()
            );

        return config;
    },
    publicRuntimeConfig: {
        app1: process.env.APP1
    },
    // ...
    // ...
}
```