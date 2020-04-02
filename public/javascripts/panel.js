/* eslint-disable quotes */
const iframeRenderer = document.querySelector('#renderer-iframe');
const editors = {};
const workingTime = 450;
let workingTimeout = null;
const htmlExternal = document.querySelector('#htmlExternal');
const jsExternal = document.querySelector('#jsExternal');
const cssExternal = document.querySelector('#cssExternal');

const htmlCode = document.querySelector('#html-code');
const jsCode = document.querySelector('#js-code');
const cssCode = document.querySelector('#css-code');

const renderTemplate = `<html>
<head class="@@EXHTML@@">
  @@EXCSS@@
  @@EXJS@@
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
  Object.values(editors).forEach((editor) => {
    editor.layout();
  });
};

const renderContent = () => {
  const jsExternalLink = `<script src="${jsExternal.value}"></script>`;
  const cssExternalLink = `<link href="${cssExternal.value}" rel="stylesheet">`;

  let output = renderTemplate
    .replace('@@HTML@@', editors.html.getValue())
    .replace('@@CSS@@', editors.css.getValue())
    .replace('@@JS@@', editors.js.getValue());

  if (htmlExternal.value) {
    output = output
      .replace('@@EXHTML@@', htmlExternal.value);
  } else {
    output = output
      .replace('@@EXHTML@@', '');
  }

  if (cssExternal.value) {
    output = output
      .replace('@@EXCSS@@', cssExternalLink);
  } else {
    output = output
      .replace('@@EXCSS@@', '');
  }

  if (jsExternal.value) {
    output = output
      .replace('@@EXJS@@', jsExternalLink);
  } else {
    output = output
      .replace('@@EXJS@@', '');
  }

  const renderer = iframeRenderer.contentWindow.document;
  renderer.open();
  renderer.write(output);
  renderer.close();
};

const handleEditorUpdate = (e) => {
  if (workingTimeout) clearTimeout(workingTimeout);
  workingTimeout = setTimeout(renderContent, workingTime);
};

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

require.config({ paths: { vs: '/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], () => {
  const htmlEditor = monaco.editor.create(
    document.querySelector('#html-editor'), {
      language: 'html',
    },
  );

  htmlEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.html = htmlEditor;

  const cssEditor = monaco.editor.create(
    document.querySelector('#css-editor'), {
      language: 'css',
    },
  );
  cssEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.css = cssEditor;

  const jsEditor = monaco.editor.create(
    document.querySelector('#js-editor'), {
      language: 'javascript',
    },
  );
  jsEditor.onDidChangeModelContent(handleEditorUpdate);
  editors.js = jsEditor;

  monaco.editor.setTheme('vs-dark');
  window.onresize = refreshEditors;

  console.log(htmlCode.innerHTML);
  if (htmlCode.innerHTML) editors.html.setValue(htmlCode.innerHTML);
  if (cssCode.innerHTML) editors.css.setValue(cssCode.innerHTML);
  if (jsCode.innerHTML) editors.js.setValue(jsCode.innerHTML);
});

$(document).ready(() => {
  $('#save-button').click((e) => {
    e.preventDefault();
    const htmlCode = editors.html.getValue();
    const cssCode = editors.css.getValue();
    const jsCode = editors.js.getValue();
    const penName = document.querySelector('#pen-name').innerHTML;
    const penId = document.querySelector('#pen-id').innerHTML;

    console.log(htmlExternal.value);
    const htmlExternalArray = [htmlExternal.value, ""];
    const cssExternalArray = [cssExternal.value, ""];
    const jsExternalArray = [jsExternal.value, ""];

    $.post('/pen',
      {
        htmlCode,
        cssCode,
        jsCode,
        penId,
        penName,
        htmlExternal: htmlExternalArray,
        cssExternal: cssExternalArray,
        jsExternal: jsExternalArray,
      });
  });

  $('#modal-save-button').click(() => {
    setTimeout(renderContent, workingTime);
  });

  $('.tabs').click(function () {
    $('.tabs').removeClass('active');
    $('.tabs h6').removeClass('font-weight-bold');
    $('.tabs h6').addClass('text-muted');
    $(this).children('h6').removeClass('text-muted');
    $(this).children('h6').addClass('font-weight-bold');
    $(this).addClass('active');

    current_fs = $('.active');

    next_fs = $(this).attr('id');
    next_fs = `#${next_fs}1`;

    $('fieldset').removeClass('show');
    $(next_fs).addClass('show');

    current_fs.animate({}, {
      step() {
        current_fs.css({
          display: 'none',
          position: 'relative',
        });
        next_fs.css({
          display: 'block',
        });
      },
    });
  });
});
