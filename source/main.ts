import path from 'path';
import Song from './model/Song';
import Settings from './settings';
import InputManager from './input';
import { Client } from 'discord-rpc';
import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, globalShortcut, nativeImage} from 'electron';
import settings from 'electron-settings';

const RPC = new Client({ transport: 'ipc' });
const APP_VERSION = require('../package.json').version;

var tray: Tray;
var mWindow: BrowserWindow;

// States
var closeToTray: boolean;
var minimizeToTray: boolean;

// Entry
function createMainWindow() {
    let userAgent: string;
    let splashWindow: BrowserWindow;
    const mainWindow = createWindow(false, 'deezer-preload.js');

    // Disable menu (only works on Windows)
    mainWindow.setMenu(null);

    // User agent
    switch (process.platform) {    
        case 'linux':
            userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
            break;

        case 'darwin':
            userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
            break;

        // win32
        default:
            userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
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

        if (closeToTray) mainWindow.hide(); else app.exit();
    });

    mainWindow.on('minimize', () => {
        if (minimizeToTray) mainWindow.hide();
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

    closeToTray = await settings.get('closeToTray') == true;
    minimizeToTray = await settings.get('minimizeToTray') == true;

    // Tray
    const icon = nativeImage.createFromPath(`${__dirname}/view/icon.png`);
    
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
                    label: 'Play/Pause',
                    click: () => input.space()
                },
                {
                    type: 'normal',
                    label: 'Next',
                    click: () => input.shiftRight()
                },
                {
                    type: 'normal',
                    label: 'Previous',
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
                    checked: minimizeToTray,
                    click: async () => {
                        minimizeToTray = !minimizeToTray;
                        await settings.set('minimizeToTray', minimizeToTray);
                    }
                },
                {
                    type: 'checkbox',
                    label: 'Close to tray',
                    checked: closeToTray,
                    click: async () => {
                        closeToTray = !closeToTray;
                        await settings.set('closeToTray', closeToTray);
                    }
                },
            ]
        },
        {
            type: 'normal',
            label: `DeezerRPC ${APP_VERSION}`,
            click: () => Electron.shell.openExternal("https://github.com/Braasileiro/DeezerRPC")
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

    // Set global MainWindow
    mWindow = mainWindow;
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


// App
app.on('ready', createMainWindow);


// Initialize RPC
RPC.login({ clientId: Settings.DiscordClientID }).catch(() => {
    dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and relaunch this application.");
});
