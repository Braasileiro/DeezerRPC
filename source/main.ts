import path from 'path';
import Song from './model/Song';
import Settings from './settings';
import { Client } from 'discord-rpc';
import { app, BrowserWindow, ipcMain } from 'electron';

var mainWindow: BrowserWindow;
var splashWindow: BrowserWindow;
const RPC = new Client({ transport: 'ipc' });


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
ipcMain.on('song-changed', (event: any, song: Song) => {
    RPC.setActivity({
        details: song.name,
        state: `${song.album}`,
        startTimestamp: new Date().getDate(),
        instance: false,
    });
});


// Initialize Trigger
app.on('ready', createMainWindow);


// Initialize RPC
RPC.login({ clientId: Settings.DiscordClientID }).catch(console.error);
