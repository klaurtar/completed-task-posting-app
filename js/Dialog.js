class Dialog {
  constructor(
    options = {
      color: '#66FCf1',
      doneButtonText: 'Save',
      padding: '20px',
      width: '50%',
    }
  ) {
    this.options = options;

    this.$dialogElement = document.createElement('div');
    this.$dialogElement.className = 'dialog-container';
    this.$dialogElement.innerHTML = ejs.render(dialogTemplate);

    this.$dialogBox = this.$dialogElement.children[0].children[1];
    this.$dialogOverlay = this.$dialogElement.children[0].children[0];

    this.$head = this.$dialogBox.querySelector('.head');
    this.$body = this.$dialogElement.querySelector('.body');

    this.$body.style.color = this.options.color;
    this.$body.style.padding = this.options.padding;

    this.$doneButton = this.$dialogBox.querySelector('.done-button');
    this.$cancelButton = this.$dialogBox.querySelector('.cancel-button');
    this.$exitButton = this.$dialogBox.querySelector('.x-icon');

    this.$dialogBox.style.width = this.options.width;
    this.$doneButton.innerText = this.options.doneButtonText;

    this.onSaveHandler = [];
    this.onCloseHandler = [];

    this.setUpListeners();
  }

  open() {
    this.$dialogBox.style.display = 'block';
    this.$dialogOverlay.style.display = 'block';
  }

  close() {
    this.$dialogElement.remove();
  }

  setContent($content) {
    if (typeof $content === 'string') {
      this.$body.innerHTML = $content;
    } else {
      this.$body.appendChild($content);
    }
  }

  onSave(callbackHandler) {
    this.onSaveHandler.push(callbackHandler);
  }

  onClose(callBackHandler) {
    this.onCloseHandler.push(callBackHandler);
  }

  getDialogElement() {
    return this.$dialogElement;
  }

  setUpListeners() {
    this.$doneButton.addEventListener('click', () => {
      let allowClose = true;
      this.onSaveHandler.forEach((handler) => {
        if (handler() === false) allowClose = false;
      });
      // this.onSaveHandler && this.onSaveHandler();
      if (allowClose) {
        this.close();
      }
    });
    this.$cancelButton.addEventListener('click', () => {
      this.onCloseHandler.forEach((handler) => {
        handler();
      });
      this.close();
      // this.onCloseHandler && this.onCloseHandler();
    });
    this.$exitButton.addEventListener('click', () => {
      this.close();
    });
  }
}
