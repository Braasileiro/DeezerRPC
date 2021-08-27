import dayjs from 'dayjs';
import { RPC } from '../app/app';
import { Song }  from '../model/song';
import * as Tray from '../manager/tray';
import { globalShortcut } from 'electron';

var last = '';
var song: Song;

export function togglePause() {
    __mainWindow.webContents.executeJavaScript('dzPlayer.control.togglePause();');
}

export function nextSong() {
    __mainWindow.webContents.executeJavaScript('dzPlayer.control.nextSong();');
}

export function prevSong() {
    __mainWindow.webContents.executeJavaScript('dzPlayer.control.prevSong();');
}

export function registerShortcuts() {
    globalShortcut.register('MediaPlayPause', () => togglePause());
    globalShortcut.register('MediaNextTrack', () => nextSong());
    globalShortcut.register('MediaPreviousTrack', () => prevSong());
}

export function registerEvents() {
    setInterval(function () {
        try {
            __mainWindow.webContents.executeJavaScript(
                `[
                    dzPlayer.getSongTitle(),
                    dzPlayer.getAlbumTitle(),
                    dzPlayer.getArtistName(),
                    dzPlayer.isPlaying(),
                    dzPlayer.getCover(),
                    dzPlayer.getCurrentSong().MD5_ORIGIN,
                    dzPlayer.getDuration(),
                    dzPlayer.getRemainingTime(),
                ]`
            ).then(result => {
                let [title, album, artist, listening, cover, hash, duration, remaining] = result;
    
                song = new Song(title, album, artist, listening, hash, cover, timestamp(listening, duration, remaining));
                
                RPC.setActivity({
                    details: song.title,
                    state: song.artist,
                    endTimestamp: song.time,
                    largeImageKey: 'default',
                    largeImageText: song.album,
                    smallImageKey: song.imageKey,
                    smallImageText: song.status,
                    instance: false,
                });
            
                if (last !== hash) {
                    Tray.setMessage(song.trayMessage);
    
                    last = hash;
                }
            });
        } catch (e) {
            console.error(e);
        }
    }, 5000);
}

function timestamp(listening: boolean, duration: number, remaining: number): number | undefined {
    if (listening) {
        return dayjs(Date.now())
        .add(remaining, 's')
        .unix();
    }

    return undefined;
}
