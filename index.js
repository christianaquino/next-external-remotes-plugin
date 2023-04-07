/*!
 * NextExternalTemplateRemotesPlugin 
 * Based on Zackary Jackson's ExternalTemplateRemotesPlugin
 * https://www.npmjs.com/package/external-remotes-plugin
 * 
 * Adapted to work with NextFederationPlugin
 */

const { RawSource } = require('webpack-sources');

const PLUGIN_NAME = 'NextExternalTemplateRemotesPlugin';

class NextExternalTemplateRemotesPlugin {
    apply(compiler) {
        compiler.hooks.make.tap(PLUGIN_NAME, compilation => {
            const scriptExternalModules = [];

            compilation.hooks.buildModule.tap(PLUGIN_NAME, module => {
                if (module.constructor.name === 'ExternalModule' && module.externalType === 'promise') {
                    scriptExternalModules.push(module);
                }
            });

            compilation.hooks.afterCodeGeneration.tap(PLUGIN_NAME, function() {
                scriptExternalModules.map(module => {
                    const regex = /new\s+URL\("([^"]*?)"\);/g;
                    const sourceMap = compilation.codeGenerationResults.get(module).sources;
                    const rawSource = sourceMap.get('javascript');
                    const match = regex.exec(rawSource.source());

                    if (match !== null) {
                        const urlTemplate = match[1];
                        const urlExpression = toExpression(urlTemplate);                        
                        sourceMap.set(
                            'javascript',
                            new RawSource(rawSource.source().replace(`"${urlTemplate}"`, urlExpression))
                        );
                    }
                });
            });
        });
    }
}

function toExpression(templateUrl) {
    const result = [];
    const current = [];
    let isExpression = false;
    let invalid = false;
    for (const c of templateUrl) {
        if (c === '[') {
            if (isExpression) {
                invalid = true;
                break;
            }
            isExpression = true;
            if (current.length) {
                result.push(`"${current.join('')}"`);
                current.length = 0;
            }
        } else if (c === ']') {
            if (!isExpression) {
                invalid = true;
                break;
            }
            isExpression = false;
            if (current.length) {
                result.push(`${current.join('')}`);
                current.length = 0;
            }
            current.length = 0;
        } else {
            current.push(c);
        }
    }
    if (isExpression || invalid) {
        throw new Error(`Invalid template URL "${templateUrl}"`);
    }
    if (current.length) {
        result.push(`"${current.join('')}"`);
    }
    return result.join(' + ');
}

module.exports = NextExternalTemplateRemotesPlugin;
