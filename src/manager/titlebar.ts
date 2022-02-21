import * as path from 'path';
import { BrowserView, BrowserWindow, ipcMain } from 'electron';

var titlebar: BrowserView | null = null;

export function register() {
    if (titlebar == null) {
        titlebar = new BrowserView({
            webPreferences: {
                preload: path.join(__dirname, '../preload/titlebar.js')
            }
        });

        titlebar.setAutoResize({
            width: true
        });

        titlebar.setBounds({
            x: 0,
            y: 0,
            width: __mainWindow.getBounds().width,
            height: 30
        });

        titlebar.webContents.loadFile(path.join(__dirname, '../web/titlebar.html'));

        __mainWindow.setBrowserView(titlebar);
    }
}

export function unregister() {
    if (titlebar != null) {
        __mainWindow.removeBrowserView(titlebar);

        titlebar = null;
    }
}


// IPC
ipcMain.on('window-minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    window?.minimize();
});

ipcMain.on('window-maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (window) {
        window.isMaximized() ? window.unmaximize() : window.maximize();
    }
});

ipcMain.on('window-close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    window?.close();
});

ipcMain.on('window-is-maximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    event.returnValue = window?.isMaximized();
});
