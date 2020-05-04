import path from 'path';
import Song from './model/Song';
import Settings from './settings';
import { Client } from 'discord-rpc';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';

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

    mainWindow.on('close', (event) => {
        event.preventDefault();

        mainWindow.destroy();
    });

    createSplashWindow();
}


// IPC
ipcMain.on('song-changed', (event: any, song: Song) => {
    if (!song.artist) {
        song.artist = "Unknown Artist";
    }

    if (!song.name) {
        song.name = "Unknown Song";
    }

    RPC.setActivity({
        details: song.name,
        state: song.artist,
        endTimestamp: song.time,
        largeImageKey: "default",
        largeImageText: "Album",
        smallImageKey: "default",
        smallImageText: "Listening",
        instance: false,
    });
});


// App
app.on('ready', createMainWindow);


// Initialize RPC
RPC.login({ clientId: Settings.DiscordClientID }).catch(() => {
    dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and reopen this application.");
});
