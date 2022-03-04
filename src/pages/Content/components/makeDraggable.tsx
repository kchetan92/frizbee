//src: https://www.w3schools.com/howto/howto_js_draggable.asp

const makeDraggable = (body: HTMLDivElement, dragHandle: HTMLButtonElement) => {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0,
    top = '',
    left = '';

  const closeDragEvent = (e: MouseEvent) => {
    document.removeEventListener('mouseup', closeDragEvent);
    document.removeEventListener('mousemove', elementDrag);
    dragHandle.classList.remove('dragging');
    chrome.storage.local.set({ top, left });
  };

  const elementDrag = (e: MouseEvent) => {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    top = body.offsetTop - pos2 + 'px';
    left = body.offsetLeft - pos1 + 'px';
    body.style.top = top;
    body.style.left = left;
    body.style.right = 'initial';
  };

  const dragMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.addEventListener('mouseup', closeDragEvent);
    document.addEventListener('mousemove', elementDrag);
    dragHandle.classList.add('dragging');
  };
  chrome.storage.onChanged.addListener(function (changes) {
    if (
      changes.top &&
      changes.left &&
      (changes.top.newValue !== changes.top.oldValue ||
        changes.left.newValue !== changes.left.oldValue)
    ) {
      body.style.top = changes.top.newValue;
      body.style.left = changes.left.newValue;
      body.style.right = 'initial';
    }
  });

  dragHandle.onmousedown = dragMouseDown;
};

export default makeDraggable;
