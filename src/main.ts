import got from 'got';
import path from 'path';
import Song from './model/Song';
import Settings from './settings';
import InputManager from './input';
import { Client } from 'discord-rpc';
import Configstore from 'configstore';
import settings from 'electron-settings';
import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage, shell } from 'electron';

const RPC = new Client({ transport: 'ipc' });
const APP_PACKAGE = require('../package.json');
const APP_PREFERENCES = new Configstore(APP_PACKAGE.name, { "closeToTray": false, "minimizeToTray": false });

var tray: Tray;

// Entry
function main() {
    const url = 'https://raw.githubusercontent.com/Braasileiro/DeezerRPC/master/package.json';

    checkUrl(url)
        .then(() => got(url).then(response => {
            const json = JSON.parse(response.body);

            if (json.version != APP_PACKAGE.version) {
                const result = dialog.showMessageBoxSync({
                    type: 'info',
                    buttons: [`Let's fucking go!`, 'Not now...'],
                    defaultId: 0,
                    title: 'DeezerRPC Updater',
                    message: `DeezerRPC ${json.version} is now available`,
                    detail: 'Do you want to be redirected to update?'
                });

                if (result == 0) {
                    shell.openExternal(json.homepage);
                    process.exit(1);
                } else {
                    createMainWindow();
                }
            }
        })
    )
    .catch(() => createMainWindow());
}

function createMainWindow() {
    let userAgent: string;
    let splashWindow: BrowserWindow;
    const mainWindow = createWindow(false, 'preload.js');

    // Disable menu (only works on Windows)
    mainWindow.setMenu(null);

    // User agent
    switch (process.platform) {
        case 'linux':
            userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            break;

        case 'darwin':
            userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            break;

        // win32
        default:
            userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            break;
    }

    mainWindow.loadURL(Settings.DeezerUrl, { userAgent: userAgent });

    // MainWindow
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.show();
        splashWindow.close();
        registerShortcutsAndTray(mainWindow);
    });

    // Events
    mainWindow.on('close', (event) => {
        event.preventDefault();

        if (getPreference<boolean>('closeToTray')) mainWindow.hide(); else app.exit();
    });

    mainWindow.on('minimize', () => {
        if (getPreference<boolean>('minimizeToTray')) mainWindow.hide();
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

async function registerShortcutsAndTray(mainWindow: BrowserWindow) {
    const input = new InputManager(mainWindow.webContents);

    // Tray
    const icon = nativeImage.createFromPath(`${__dirname}/assets/icon.png`);

    icon.setTemplateImage(true);

    tray = new Tray(icon);

    const menu = Menu.buildFromTemplate([
        {
            type: 'normal',
            label: 'Toggle',
            click: () => {
                if (mainWindow.isVisible()) mainWindow.hide(); else mainWindow.show();
            },
        },
        { type: 'separator' },
        {
            type: 'submenu',
            label: 'Player',
            submenu: [
                {
                    type: 'normal',
                    label: '♪ Play/Pause',
                    click: () => input.space()
                },
                {
                    type: 'normal',
                    label: '→ Next',
                    click: () => input.shiftRight()
                },
                {
                    type: 'normal',
                    label: '← Previous',
                    click: () => input.shiftLeft()
                }
            ]
        },
        { type: 'separator' },
        {
            type: 'submenu',
            label: 'Settings',
            submenu: [
                {
                    type: 'checkbox',
                    label: 'Minimize to tray',
                    checked: getPreference<boolean>('minimizeToTray'),
                    click: async (item) => {
                        setPreference('minimizeToTray', item.checked);
                        await settings.set('minimizeToTray', item.checked);
                    }
                },
                {
                    type: 'checkbox',
                    label: 'Close to tray',
                    checked: getPreference<boolean>('closeToTray'),
                    click: async (item) => {
                        setPreference('closeToTray', item.checked);
                        await settings.set('closeToTray', item.checked);
                    }
                },
            ]
        },
        {
            type: 'normal',
            label: `DeezerRPC ${APP_PACKAGE.version}`,
            click: () => shell.openExternal(APP_PACKAGE.homepage)
        },
        { type: 'separator' },
        {
            type: 'normal',
            label: 'Exit',
            click: () => mainWindow.destroy()
        }
    ]);

    tray.setContextMenu(menu);
    tray.setToolTip('No music played yet.');

    // Double clicking hide/show
    tray.on('double-click', () => {
        if (mainWindow.isVisible()) mainWindow.hide(); else mainWindow.show();
    });

    // Global Shortcuts
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


// Preferences
function getPreference<T>(key: string): T {
    return APP_PREFERENCES.get(key);
}

function setPreference(key: string, value: any): any {
    return APP_PREFERENCES.set(key, value);
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

    tray.setToolTip(`${song.artist} - ${song.name}`);
});


// Utils
function checkUrl(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const { protocol } = new URL(url);

        const lib = protocol === 'https:' ? require('https') : require('http');

        const request = lib.get(url, (response: any) => resolve(response));

        request.on("error", (e: any) => reject(e));
    });
}


// App
app.on('ready', main);


// Initialize RPC
RPC.login({ clientId: Settings.DiscordClientID }).catch(() => {
    dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and relaunch this application.");
});
