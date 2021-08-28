import { APP, RPC } from './app/app';
import * as Tray from './manager/tray';
import * as Update from './util/update';
import * as Player from './player/player';
import * as Window from './manager/window';
import * as Preferences from './util/preferences';
import { app, BrowserWindow, dialog } from 'electron';


// Global
declare global {
    var __mainWindow: BrowserWindow;
}


// Entry
function main() {
    createMainWindow();
}

function createMainWindow() {
    // SplashWindow
    let splashWindow: BrowserWindow;

    // Create MainWindow
    global.__mainWindow = Window.create(false);

    // Load URL
    __mainWindow.loadURL(APP.settings.deezerUrl, { userAgent: Window.userAgent() });

    // Events
    __mainWindow.webContents.once('did-finish-load', () => {
        __mainWindow.show();
        splashWindow.close();
        Tray.register();
        Player.registerShortcuts();

        if (Preferences.getPreference<boolean>(APP.preferences.checkUpdates)) Update.checkVersion();

        // Player Events
        setTimeout(Player.registerEvents, 3000);
    });

    __mainWindow.on('minimize', () => {
        if (Preferences.getPreference<boolean>(APP.preferences.minimizeToTray)) __mainWindow.hide();
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


// App
app.on('ready', main);


// Initialize RPC
RPC.login({ clientId: APP.settings.discordClientID }).catch(() => {
    dialog.showErrorBox("Rich Presence Login Failed", "Please, verify if your discord app is opened/working and relaunch this application.");
});
