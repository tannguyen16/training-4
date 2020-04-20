/* eslint-disable quotes */
const iframeRenderer = document.querySelector('#renderer-iframe');
const editors = {};
const workingTime = 450;
let workingTimeout = null;
const htmlClass = document.querySelector('#htmlClass');
const htmlHead = document.querySelector('#htmlHead');
const jsExternal = document.querySelector('.jsExternal');
const cssExternal = document.querySelector('.cssExternal');

const renderTemplate = `<html>
<head class="@@CLASSHTML@@">
  @@HEADHTML@@
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
  let output = renderTemplate;

  if (htmlClass.value) {
    output = output
      .replace('@@CLASSHTML@@', htmlClass.value);
  } else {
    output = output
      .replace('@@CLASSHTML@@', '');
  }

  if (htmlHead.value) {
    output = output
      .replace('@@HEADHTML@@', htmlHead.value);
  } else {
    output = output
      .replace('@@HEADHTML@@', '');
  }
  const cssExternalLinks = $('.cssExternal');
  const jsExternalLinks = $('.jsExternal');

  let cssExternalString = "";
  if (cssExternalLinks.length > 0) {
    for (let i = 0; i < cssExternalLinks.length; i++) {
      cssExternalString += `<link href="${$(cssExternalLinks[i]).val()}" rel="stylesheet">`;
    }
  }
  output = output
    .replace('@@EXCSS@@', cssExternalString);

  let jsExternalString = "";
  if (jsExternalLinks.length > 0) {
    for (let i = 0; i < jsExternalLinks.length; i++) {
      jsExternalString += `<script src="${$(jsExternalLinks[i]).val()}"></script>`;
    }
  }
  output = output
    .replace('@@EXJS@@', jsExternalString);

  output = output
    .replace('@@HTML@@', editors.html.getValue())
    .replace('@@CSS@@', editors.css.getValue())
    .replace('@@JS@@', editors.js.getValue());

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

  if (htmlCode) editors.html.setValue(htmlCode);
  if (cssCode) editors.css.setValue(cssCode);
  if (jsCode) editors.js.setValue(jsCode);
});


function deleteExternal(type, id) {
  if (type === 'css') {
    const exCss = $(`#external-css-${id}`);
    exCss.remove();
  } else {
    const exJs = $(`#external-js-${id}`);
    exJs.remove();
  }
}

$(document).ready(() => {
  penNameContainer = $("#pen-name-container");
  penNameEditContainer = $('#pen-name-edit-container');

  const isEditting = false;

  $(document).click((event) => {
    if (event.target.closest('#pen-name-container') && !$('#pen-name-edit-container').is(":visible")) {
      penNameContainer.hide();
      penNameEditContainer.show();
    } else if (!event.target.closest('#pen-name-edit-container') && $('#pen-name-edit-container').is(":visible")) {
      document.querySelector('#pen-name').innerHTML = document.querySelector('#pen-name-edit').value;
      penNameContainer.show();
      penNameEditContainer.hide();
    }
  });

  $('#save-button').click((e) => {
    e.preventDefault();
    const htmlCode = editors.html.getValue();
    const cssCode = editors.css.getValue();
    const jsCode = editors.js.getValue();
    let penName = document.querySelector('#pen-name').innerHTML;
    if (document.querySelector('#pen-name-edit').value !== document.querySelector('#pen-name').innerHTML) {
      penName = document.querySelector('#pen-name-edit').value;
    }

    // const htmlExternalArray = htmlExternal.value;
    // const cssExternalArray = cssExternal.value;
    // const jsExternalArray = jsExternal.value;
    const cssExternalLinks = $('.cssExternal');
    const jsExternalLinks = $('.jsExternal');

    const cssExternalArray = [];
    for (let i = 0; i < cssExternalLinks.length; i++) {
      cssExternalArray.push($(cssExternalLinks[i]).val());
    }
    const jsExternalArray = [];
    for (let i = 0; i < jsExternalLinks.length; i++) {
      jsExternalArray.push($(jsExternalLinks[i]).val());
    }

    $.post('/pen',
      {
        htmlCode,
        cssCode,
        jsCode,
        penId,
        penName,
        htmlClass: htmlClass.value,
        htmlHead: htmlHead.value,
        cssExternal: cssExternalArray,
        jsExternal: jsExternalArray,
      },
      (data, status) => {
        window.alert('Pen saved!');
        if (window.location.pathname !== `/pen/${data}`) window.location.replace(`/pen/${data}`);
      });
  });

  $('#modal-save-button').click(() => {
    setTimeout(renderContent, workingTime);
  });

  const externalCssLinks = $("#external-css-links");
  const externalJsLinks = $("#external-js-links");

  let externalCssId = 0;
  let externalJsId = 0;

  $('#add-external-css-button').click(() => {
    const externalInput = `<div id="external-css-${externalCssId}" class="external-css-container">
                            <input class="form-control form-control-sm cssExternal" type="text" id="css-external-${externalCssId}">
                            <a href='#'>
                              <i class="fas fa-trash delete-external-css" id="delete-external-css-${externalCssId}" onclick="deleteExternal('css', ${externalCssId})"></i>
                            </a>
                          </div>`;

    externalCssLinks.append(externalInput);
    externalCssId += 1;
  });

  $('#add-external-js-button').click(() => {
    const externalInput = `<div id="external-js-${externalJsId}" class="external-js-container">
                            <input class="form-control form-control-sm jsExternal" type="text" id="js-external-${externalJsId}">
                            <a href='#'>
                              <i class="fas fa-trash delete-external-js" id="delete-external-js-${externalJsId}" onclick="deleteExternal('js', ${externalJsId})"></i>
                            </a>
                          </div>`;
    externalJsLinks.append(externalInput);
    externalJsId += 1;
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
