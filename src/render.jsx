import fs from 'fs';

//import CoreAppManifest from '@nebulario/core-dll-app/dist/manifest.json'
//import ResourcesManifest from '@nebulario/nebu.io-resources/dist/manifest.json'
const CoreAppManifest = [];
const ResourcesManifest = [];

export const renderHeader = () => {

  const style = '<link rel="stylesheet" href="/static' + ResourcesManifest['/resources/index.css'] + '">';

  return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>App module</title>
            ` + style + `
        </head>
        <body>
            <div id="root">
`
};

export const renderFooter = (css, loadableState, preloadedState, preloadedGraphState) => {

  const local = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));
  let res = `
            </div>
            <script>
                // WARNING: See the following for security issues around embedding JSON in HTML!:
                // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                window.__APOLLO_STATE__ =  ${JSON.stringify(preloadedGraphState).replace(/</g, '\\u003c')}
            </script>
            <style id="jss-server-side">${css}</style>`; //+JSON.stringify(CoreAppManifest)+JSON.stringify(ResourcesManifest);

  res += '<script src="/static' + CoreAppManifest['/core-app/base.js'] + '"></script>';
  res += '<script src="/static' + CoreAppManifest['/core-app/state.js'] + '"></script>';
  res += '<script src="/static' + CoreAppManifest['/core-app/vendor.js'] + '"></script>';
  res += '<script src="/static' + local['/app/app.js'] + '"></script>';

  res += `${loadableState.getScriptTag()}
        </body>
    </html>
`;
  return res;
};
