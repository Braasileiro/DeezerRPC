import path from 'path';
import Settings from './settings';
import { app, BrowserWindow, ipcMain } from 'electron';

var mainWindow: BrowserWindow;
var splashWindow: BrowserWindow;


// Main
function createWindow(visibility: boolean, preload?: string) {
    if (preload) {
        return new BrowserWindow({
            width: Settings.WindowWidth,
            height: Settings.WindowHeight,
            show: visibility,
            title: 'DeezerRPC',
            webPreferences: {
                preload: path.join(__dirname, preload)
            }
        });
    }

    return new BrowserWindow({
        width: Settings.WindowWidth,
        height: Settings.WindowHeight,
        show: visibility,
        title: 'DeezerRPC'
    });
}

function createSplashWindow() {
    splashWindow = createWindow(true);

    splashWindow.loadURL(`file://${__dirname}/view/splash.html`)
}

function createMainWindow() {
    mainWindow = createWindow(false, 'deezer-preload.js');

    mainWindow.loadURL(Settings.DeezerUrl);

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.show();
        splashWindow.close();
    });

    createSplashWindow();
}


// IPC
ipcMain.on('song-changed', (event: any, args: any) => {
    console.log(args);
});


// Initialize Trigger
app.on('ready', createMainWindow);
