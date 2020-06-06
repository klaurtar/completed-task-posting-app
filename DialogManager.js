const DialogManager = (function(){
    const $dialogContainerElement = document.createElement('div');
    $dialogContainerElement.className = "topLevelDialogContainer";
    document.body.appendChild($dialogContainerElement);

    
    
    return {
        createDialog: (options) => {
            const dialog = new Dialog(options);
            const $dialogElement = dialog.getDialogElement();
            $dialogContainerElement.appendChild($dialogElement);
            return dialog;
        }
    }
})();