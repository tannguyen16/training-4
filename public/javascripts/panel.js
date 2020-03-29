/* eslint-disable quotes */
const iframeRenderer = document.querySelector('#renderer-iframe');
const editors = {};
const workingTime = 450;
let workingTimeout = null;
const htmlExternal = document.querySelector('#htmlExternal').value;
const jsExternal = document.querySelector('#jsExternal').value;
const cssExternal = document.querySelector('#cssExternal').value;

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
  const jsExternalLink = `<script src="${jsExternal}"></script>`;
  const cssExternalLink = `<link href="${cssExternal}" rel="stylesheet">`;

  let output = renderTemplate
    .replace('@@HTML@@', editors.html.getValue())
    .replace('@@CSS@@', editors.css.getValue())
    .replace('@@JS@@', editors.js.getValue());

  if (htmlExternal) {
    output = output
      .replace('@@EXHTML@@', htmlExternal);
  } else {
    output = output
      .replace('@@EXHTML@@', '');
  }

  if (cssExternal) {
    output = output
      .replace('@@EXCSS@@', cssExternalLink);
  } else {
    output = output
      .replace('@@EXCSS@@', '');
  }

  if (jsExternal) {
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
});

$(document).ready(() => {
  $('#save-button').click(() => {
    const htmlCode = editors.html.getValue();
    const cssCode = editors.css.getValue();
    const jsCode = editors.js.getValue();
    const penName = document.querySelector('#pen-name').innerHTML;
    const penId = document.querySelector('#pen-id').innerHTML;

    const htmlExternalArray = ["", ""];
    const cssExternalArray = ["", ""];
    const jsExternalArray = ["", ""];

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
      },
      (data, status) => {
        alert(`Data: ${data}\nStatus: ${status}`);
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
