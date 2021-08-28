import { ipcMain } from 'electron';
import IPCSong  from './model/song';
import { APP, RPC } from '../app/app';
import * as Tray from '../manager/tray';

var LAST: string;

export function registerEvents() {
    ipcMain.on('song-changed', (event: any, song: IPCSong) => {
        RPC.setActivity({
            details: song.name,
            state: song.artist,
            endTimestamp: song.time,
            largeImageKey: 'default',
            largeImageText: APP.name,
            smallImageKey: song.imageKey,
            smallImageText: song.status,
            instance: false,
        });

        if (LAST !== song.description) {
            Tray.setMessage(`${song.artist} • ${song.name}`);

            LAST = song.description;
        }
    });
}
