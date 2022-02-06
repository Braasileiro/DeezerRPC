import { APP, RPC } from './app/app';
import * as Tray from './manager/tray';
import * as Update from './util/update';
import * as Player from './player/player';
import * as Playlist from './playlist/playlist';
import * as Window from './manager/window';
import * as Preferences from './util/preferences';
import * as path from 'path';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';

// Entry
function main() {
    createMainWindow();
}

function createMainWindow() {
    // SplashWindow
    let splashWindow: BrowserWindow;

    // Create MainWindow
    global.__mainWindow = Window.create(false, path.join(__dirname, 'app/preload.js'));

    // Load URL
    __mainWindow.loadURL(APP.settings.deezerUrl, { userAgent: Window.userAgent() });

    // Events
    __mainWindow.webContents.once('did-finish-load', () => {
        __mainWindow.show();
        splashWindow.close();
        Tray.register();
        Player.registerShortcuts();
        Playlist.registerContextMenu();

        if (Preferences.getPreference<boolean>(APP.preferences.checkUpdates)) Update.checkVersion(false);

        // Initialize RPC
        initializeRPC();
    });

    __mainWindow.on('minimize', () => {
        if (Preferences.getPreference<boolean>(APP.preferences.minimizeToTray)) __mainWindow.hide();
    });

    ipcMain.on('window-minimize', (event, eventName) => {
        const window = BrowserWindow.fromWebContents(event.sender);

        window?.minimize();
    });

    ipcMain.on('window-is-maximized', (event, eventName) => {
        const window = BrowserWindow.fromWebContents(event.sender);

        event.returnValue = window?.isMaximized();
    });

    ipcMain.on('window-maximize', (event, eventName) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        if (window) {
            window.isMaximized() ? window.unmaximize() : window.maximize()
        }
    });

    ipcMain.on('window-close', (event, eventName) => {
        const window = BrowserWindow.fromWebContents(event.sender);
        window?.close();
    });

    __mainWindow.on('close', (event) => {
        event.preventDefault();

        if (Preferences.getPreference<boolean>(APP.preferences.closeToTray)) __mainWindow.hide(); else app.exit();
    });

    // Create SplashWindow
    splashWindow = Window.create(true);
    splashWindow.setMenu(null);
    splashWindow.setResizable(false);
    splashWindow.setMaximizable(false);
    splashWindow.loadURL(`file://${__dirname}/web/splash.html`)
}

function initializeRPC() {
    RPC.login({ clientId: APP.settings.discordClientID }).then(() => {
        setTimeout(Player.registerRPC, 3000);
    }).catch(() => {
        dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and relaunch this application.");
    });
}


// App
app.on('ready', main);
