import Song from './model/Song';
import { ipcRenderer } from 'electron';

var song: string[];

function songListener() {

    const bottomPlay = document.querySelector("button.svg-icon-group-btn.is-highlight")!;

    const observer = new MutationObserver(() => {
        song = document.querySelector("div.marquee-content")!.textContent!.split(" · ");

        ipcRenderer.send('song-changed', new Song(song[0], song[1]));
    });
    
    observer.observe(bottomPlay, { attributes: true });
}


// IPC
setTimeout(songListener, 3000);
