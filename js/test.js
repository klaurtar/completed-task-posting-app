const $testButton = document.querySelector('#test-btn');

const inputTest = document.createElement('input');

$testButton.addEventListener("click", () => {
    const dialog = DialogManager.createDialog();
    dialog.open();
    dialog.setContent(inputTest)


    dialog.onSave(() => {
        // make validation
        // if valide post -> return true
        // if not -> render errors + return false
        return inputTest.value == 1 ? true : false;
    })
})