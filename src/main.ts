import * as path from 'path';
import { APP, RPC } from './app/app';
import * as Tray from './manager/tray';
import * as Update from './util/update';
import * as Player from './player/player';
import * as Window from './manager/window';
import * as Titlebar from './manager/titlebar';
import * as Preferences from './util/preferences';
import { app, BrowserWindow, dialog } from 'electron';

// Entry
function main() {
    createMainWindow();
}

function createMainWindow() {
    // SplashWindow
    let splashWindow: BrowserWindow;

    // Create MainWindow
    global.__mainWindow = Window.createWindow(
        false, {
            titleBarStyle: 'hidden',
            webPreferences: {
                preload: path.join(__dirname, 'preload/deezer.js')
            }
        }
    );

    // Load URL
    __mainWindow.loadURL(APP.settings.deezerUrl, { userAgent: Window.userAgent() });

    // Events
    __mainWindow.webContents.once('did-finish-load', () => {
        __mainWindow.show();
        splashWindow.close();

        Tray.register();
        Player.registerShortcuts();

        if (Preferences.getPreference<boolean>(APP.preferences.checkUpdates)) Update.checkVersion(false);

        // Initialize RPC
        initializeRPC();
    });

    __mainWindow.on('show', () => {
        Titlebar.register();
    });

    __mainWindow.on('hide', () => {
        Titlebar.unregister();
    })

    __mainWindow.on('minimize', () => {
        if (Preferences.getPreference<boolean>(APP.preferences.minimizeToTray)) __mainWindow.hide();
    });

    __mainWindow.on('close', (event) => {
        event.preventDefault();

        if (Preferences.getPreference<boolean>(APP.preferences.closeToTray)) __mainWindow.hide(); else app.exit();
    });

    // Create SplashWindow
    splashWindow = Window.createWindow(true);
    splashWindow.setResizable(false);
    splashWindow.setMaximizable(false);
    splashWindow.loadFile(path.join(__dirname, './web/splash.html'));
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
