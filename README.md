# next-external-remotes-plugin

**Host next.config.js**

Using env vars:

```js
    webpack(config) {
            config.plugins.push(
                new NextFederationPlugin({
                    name: 'container',
                    remotes: {
                        app1: 'app@[window.__NEXT_DATA__.runtimeConfig.app1]'
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
```