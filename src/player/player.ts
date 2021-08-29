import dayjs from 'dayjs';
import { RPC } from '../app/app';
import Song  from '../model/song';
import Radio from '../model/radio';
import Unknown from '../model/unknown';
import Episode  from '../model/episode';
import * as Tray from '../manager/tray';
import { globalShortcut } from 'electron';
import PlayerModel from '../model/player';

var LAST = '';
var SONG: PlayerModel;
var RADIO_TIMESTAMP: number;

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

export function registerRPC() {
    setInterval(function () {
        try {
            __mainWindow.webContents.executeJavaScript(
                `[
                    dzPlayer.getCurrentSong(),
                    dzPlayer.isPlaying(),
                    dzPlayer.getRemainingTime()
                ]`
            ).then(result => {
                let [current, listening, remaining] = result;

                SONG = getSong(current, listening, remaining);

                RPC.setActivity({
                    details: SONG.title,
                    state: SONG.getState(),
                    startTimestamp: SONG.getStartTimestamp(),
                    endTimestamp: SONG.getEndTimestamp(),
                    largeImageKey: 'default',
                    largeImageText: SONG.getImageText(),
                    smallImageKey: SONG.statusKey,
                    smallImageText: SONG.statusText,
                    instance: false,
                });
            
                if (LAST !== SONG.id) {
                    Tray.setMessage(SONG.trayMessage);
                    LAST = SONG.id;
                }
            });
        } catch (e) {
            console.error(e);
        }
    }, 5000);
}

function getSong(current: any, listening: boolean, remaining: number): PlayerModel {    
    if (current.LIVE_ID) {
        if (`RADIO_${current.LIVE_ID}` != LAST) RADIO_TIMESTAMP = dayjs(Date.now()).unix()

        return new Radio(
            `RADIO_${current.LIVE_ID}`,
            current.LIVESTREAM_TITLE,
            listening,
            current.LIVESTREAM_IMAGE_MD5,
            RADIO_TIMESTAMP
        );
    }

    if (current.EPISODE_ID) {
        return new Episode(
            `EPISODE_${current.EPISODE_ID}`,
            current.EPISODE_TITLE,
            listening,
            current.SHOW_ART_MD5,
            timestamp(listening, remaining),
            current.SHOW_NAME,
            current.EPISODE_DESCRIPTION
        );
    }

    if (current.SNG_ID) {
        return new Song(
            `SONG_${current.SNG_ID}`,
            current.SNG_TITLE,
            listening,
            current.ALB_PICTURE,
            timestamp(listening, remaining),
            current.ALB_TITLE,
            current.ART_NAME
        );
    }

    return new Unknown(
        'UNKNOWN',
        'Unknown Title',
        false,
        undefined,
        undefined
    );
}

function timestamp(listening: boolean, remaining: number): number | undefined {
    if (listening) {
        return dayjs(Date.now())
        .add(remaining, 's')
        .unix();
    }

    return undefined;
}
