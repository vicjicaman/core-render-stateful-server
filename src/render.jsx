import fs from 'fs';

const renderManifest = (mount, manifest, mode) => {
  let res = '';
  for (const key in manifest) {
    const file = manifest[key];
    if (key.endsWith('js') && mode === 'js') {
      res += '<script src="/mounts/' + mount + '/' + file + '"></script>\n';
    }

    if (key.endsWith('css') && mode === 'css') {
      res += '<link rel="stylesheet" href="/mounts/' + mount + '/' + file + '"/>\n';
    }
  }
  return res;
}

export const renderHeader = ({mounts}) => {

  let mountRes = '';
  for (const m in mounts) {
    const {manifest} = mounts[m];
    mountRes += renderManifest(m, manifest, 'css');
  }

  return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>App module</title>
            ` + mountRes + `
        </head>
        <body>
            <div id="root">
`
};

export const renderFooter = ({css, loadableState, preloadedState, preloadedGraphState, mounts}) => {

  let res = `
</div>`;
  res += loadableState.getScriptTag();
  res += `<script>
                // WARNING: See the following for security issues around embedding JSON in HTML!:
                // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
                window.__APOLLO_STATE__ =  ${JSON.stringify(preloadedGraphState).replace(/</g, '\\u003c')}
            </script>
            <style id="jss-server-side">${css}</style>`; //+JSON.stringify(CoreAppManifest)+JSON.stringify(ResourcesManifest);


  for (const m in mounts) {
    const {manifest} = mounts[m];
    res += renderManifest(m, manifest, 'js');
  }

  res += `

        </body>
    </html>
`;
  return res;
};
