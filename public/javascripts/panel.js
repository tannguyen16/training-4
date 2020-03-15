var element1 = document.getElementById('panel-1');
var element2 = document.getElementById('panel-2');
var element3 = document.getElementById('panel-3');
var element4 = document.getElementById('render-panel');


//create box in bottom-left
var resizer1 = document.getElementById('handle-2');
var resizer2 = document.getElementById('handle-3');
var resizer3 = document.getElementById('render-handle');


//box function onmousemove
resizer1.addEventListener('mousedown', initResize1, false);
resizer2.addEventListener('mousedown', initResize2, false);
resizer3.addEventListener('mousedown', initResize3, false);

//Window funtion mousemove & mouseup
function initResize1(e) {
   window.addEventListener('mousemove', Resize1, false);
   window.addEventListener('mouseup', stopResize1, false);
}

function initResize2(e) {
   window.addEventListener('mousemove', Resize2, false);
   window.addEventListener('mouseup', stopResize2, false);
}

function initResize3(e) {
   window.addEventListener('mousemove', Resize3, false);
   window.addEventListener('mouseup', stopResize3, false);
}

//resize the element
function Resize1(e) {
  console.log(e);
  console.log(element1.style.width);
  const e3Width = element3.style.width
  element1.style.width = (e.clientX - element1.offsetLeft) + 'px';
  element3.style.width = e3Width;
}

function Resize2(e) {
  element2.style.width = (e.clientX - element2.offsetLeft) + 'px';
}

function Resize3(e) {
  console.log(e);
  element4.style.height = (e.clientY - element4.offsetBottom) + 'px';
}

//on mouseup remove windows functions mousemove & mouseup
function stopResize1(e) {
    window.removeEventListener('mousemove', Resize1, false);
    window.removeEventListener('mouseup', stopResize1, false);
}

function stopResize2(e) {
    window.removeEventListener('mousemove', Resize2, false);
    window.removeEventListener('mouseup', stopResize2, false);
}

function stopResize3(e) {
    window.removeEventListener('mousemove', Resize3, false);
    window.removeEventListener('mouseup', stopResize3, false);
}