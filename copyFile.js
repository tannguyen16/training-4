const fs = require("fs-extra");

function copyEditorFiles() {
  fs.copySync(
    `${__dirname}/node_modules/monaco-editor/`,
    `${__dirname}/public/monaco-editor/`
  );
}

copyEditorFiles();
