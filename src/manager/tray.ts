import path from 'path';
import { APP } from '../app/app';
import * as Update from '../util/update';
import * as Player from '../player/player';
import * as Preferences from '../util/preferences';
import { app, Menu, shell, Tray } from 'electron';

var tray: Tray;

export function register() {

    tray = new Tray(path.join(
        __dirname,
        process.platform == 'win32' ? '../assets/tray/tray.ico' : '../assets/tray/tray.png'
    ));

    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                type: 'normal',
                label: 'Toggle',
                click: () => __mainWindow.isVisible() ? __mainWindow.hide() : __mainWindow.show()
            },
            { type: 'separator' },
            {
                type: 'submenu',
                label: 'Player',
                submenu: [
                    {
                        type: 'normal',
                        label: 'Play/Pause',
                        click: () => Player.togglePause()
                    },
                    {
                        type: 'normal',
                        label: 'Next',
                        click: () => Player.nextSong()
                    },
                    {
                        type: 'normal',
                        label: 'Previous',
                        click: () => Player.prevSong()
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
                        checked: Preferences.getPreference<boolean>(APP.preferences.minimizeToTray),
                        click: (item) => Preferences.setPreference(APP.preferences.minimizeToTray, item.checked)
                    },
                    {
                        type: 'checkbox',
                        label: 'Close to tray',
                        checked: Preferences.getPreference<boolean>(APP.preferences.closeToTray),
                        click: (item) => Preferences.setPreference(APP.preferences.closeToTray, item.checked)
                    },
                    {
                        type: 'checkbox',
                        label: 'Check for updates on startup',
                        checked: Preferences.getPreference<boolean>(APP.preferences.checkUpdates),
                        click: (item) => Preferences.setPreference(APP.preferences.checkUpdates, item.checked)
                    },
                ]
            },
            {
                type: 'normal',
                label: 'Check for updates',
                click: () => Update.checkVersion()
            },
            {
                type: 'normal',
                label: `${APP.name} ${APP.version}`,
                click: () => shell.openExternal(APP.homepage)
            },
            { type: 'separator' },
            {
                type: 'normal',
                label: 'Exit',
                click: () => app.exit()
            }
        ])
    );

    // Initial Message
    setMessage('No music played yet.');

    // Events
    tray.on('double-click', () => __mainWindow.isVisible() ? __mainWindow.hide() : __mainWindow.show());
}

export function setMessage(message: string) {
    tray.setToolTip(message);
}
