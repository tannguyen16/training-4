const iframeRenderer = document.querySelector('#renderer-iframe');
const editors = {};
const workingTime = 450;
let workingTimeout = null;

const renderTemplate = `<html>
<head>
  <style>
  @@CSS@@
  </style>
</head>
<body>
  @@HTML@@
  <script>
  @@JS@@
  </script>
</body>
</html>`;

const refreshEditors = () => {
  Object.values(editors).forEach(editor => {
    editor.layout();
  });
}

const renderContent = () => {
  const output = renderTemplate
                    .replace('@@HTML@@', editors.html.getValue())
                    .replace('@@CSS@@', editors.css.getValue())
                    .replace('@@JS@@', editors.js.getValue());

  const renderer = iframeRenderer.contentWindow.document;
  renderer.open();
  renderer.write(output);
  renderer.close();
}

const handleEditorUpdate = (e) => {
  if (workingTimeout) clearTimeout(workingTimeout);
  workingTimeout = setTimeout(renderContent, workingTime);
}

Split(['#editors-container', '#renderer-container'], {
  sizes: [50, 50],
  direction: 'vertical',
  onDrag: refreshEditors,
  onDragEnd: refreshEditors,
});

Split(['#html-editor', '#css-editor', '#js-editor'], {
  sizes: [33, 33, 33],
  direction: 'horizontal',
  onDrag: refreshEditors,
  onDragEnd: refreshEditors,
});

require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  
  const htmlEditor = monaco.editor.create(
    document.querySelector('#html-editor'), {
      language: 'html',
  });
  
  htmlEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.html = htmlEditor;

  const cssEditor = monaco.editor.create(
    document.querySelector('#css-editor'), {
      language: 'css',
  });
  cssEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.css = cssEditor;

  const jsEditor = monaco.editor.create(
    document.querySelector('#js-editor'), {
      language: 'javascript',
  });
  jsEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.js = jsEditor;

  monaco.editor.setTheme('vs-dark');
  window.onresize = refreshEditors;
});