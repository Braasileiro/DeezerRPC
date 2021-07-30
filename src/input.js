module.exports = class InputManager {

    constructor(webContents) {
        this.webContents = webContents;
    }

    space() {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Space'
        });
    }

    shiftLeft() {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Shift'
        });

        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Left',
            modifiers: ['Shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Left',
            modifiers: ['Shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Shift'
        });
    }

    shiftRight() {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Shift'
        });

        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Right',
            modifiers: ['Shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Right',
            modifiers: ['Shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Shift'
        });
    }
}
