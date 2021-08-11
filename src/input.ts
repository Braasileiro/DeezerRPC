export default class InputManager {
    private webContents: Electron.WebContents;

    constructor(webContents: Electron.WebContents) {
        this.webContents = webContents;    
    }

    space(): void {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Space'
        });
    }

    shiftLeft(): void {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Shift'
        });

        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Left',
            modifiers: ['shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Left',
            modifiers: ['shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Shift'
        });
    }

    shiftRight(): void {
        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Shift'
        });

        this.webContents.sendInputEvent({
            type: 'keyDown',
            keyCode: 'Right',
            modifiers: ['shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Right',
            modifiers: ['shift']
        });

        this.webContents.sendInputEvent({
            type: 'keyUp',
            keyCode: 'Shift'
        });
    }
}
