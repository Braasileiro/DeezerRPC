import path from 'path';
import Song from './model/Song';
import Settings from './settings';
import InputManager from './input';
import { Client } from 'discord-rpc';
import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron';

const RPC = new Client({ transport: 'ipc' });


// Entry
function createMainWindow() {
    let userAgent: string;
    let splashWindow: BrowserWindow;
    const mainWindow = createWindow(false, 'deezer-preload.js');

    // Main
    mainWindow.setMenu(null);

    switch (process.platform) {    
        case 'linux':
            userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36'
            break;

        case 'darwin':
            userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36'
            break;

        // win32
        default:
            userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36'
            break;
    }

    mainWindow.loadURL(Settings.DeezerUrl, { userAgent: userAgent });

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.show();
        splashWindow.close();
        registerShortcuts(mainWindow.webContents);
    });

    mainWindow.on('close', (event) => {
        event.preventDefault();
        mainWindow.destroy();
    });

    // Splash
    splashWindow = createWindow(true);
    splashWindow.setResizable(false);
    splashWindow.setMaximizable(false);
    splashWindow.setMenu(null);

    splashWindow.loadURL(`file://${__dirname}/view/splash.html`)
}

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

function registerShortcuts(webContents: Electron.WebContents) {
    const input = new InputManager(webContents);

    globalShortcut.register('MediaPlayPause', () => {
        input.space();
    });

    globalShortcut.register('MediaPreviousTrack', () => {
        input.shiftLeft();
    });

    globalShortcut.register('MediaNextTrack', () => {
        input.shiftRight();
    });
}


// IPC
ipcMain.on('song-changed', (event: any, song: Song) => {
    if (!song.artist) {
        song.artist = "Unknown Artist";
    }

    if (!song.name) {
        song.name = "Unknown Song";
    }

    if (song.listening) {
        RPC.setActivity({
            details: song.name,
            state: song.artist,
            endTimestamp: song.time,
            largeImageKey: "default",
            largeImageText: "DeezerRPC",
            smallImageKey: "listening",
            smallImageText: "Listening",
            instance: false,
        });
    } else {
        RPC.setActivity({
            details: song.name,
            state: song.artist,
            largeImageKey: "default",
            largeImageText: "DeezerRPC",
            smallImageKey: "paused",
            smallImageText: "Paused",
            instance: false,
        });
    }
});


// App
app.on('ready', createMainWindow);


// Initialize RPC
RPC.login({ clientId: Settings.DiscordClientID }).catch(() => {
    dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and reopen this application.");
});
