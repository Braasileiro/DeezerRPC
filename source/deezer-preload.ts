import Song from './model/Song';
import { ipcRenderer } from 'electron';

var song: string[];

function songListener() {

    const marqueeContent = document.querySelector("div.marquee-content")!;

    const observer = new MutationObserver(() => {
        song = marqueeContent.textContent!.split(" · ");

        ipcRenderer.send('song-changed', new Song(song[0], song[1]));
    });
    
    observer.observe(marqueeContent, { childList: true });
}


// IPC
setTimeout(songListener, 3000);
