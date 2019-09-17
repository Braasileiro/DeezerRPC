import Song from './model/Song';
import { ipcRenderer } from 'electron';

var song: string[];
var isPlaying: boolean;
var playButtonObserver: MutationObserver;
var songContentObserver: MutationObserver;


function initializeListeners() {

    // Song Listener
    const songContent = document.querySelector("div.marquee-content")!;

    songContentObserver = new MutationObserver(() => {
        song = songContent.textContent!.split(" · ");

        ipcRenderer.send('song-changed', new Song(song[0], song[1]));
    });
    
    songContentObserver.observe(songContent, { childList: true });


    // Play Button Listener
    const playContent = document.querySelector("button.svg-icon-group-btn.is-highlight")!;

    playButtonObserver = new MutationObserver(() => {
        isPlaying = playContent.getAttribute("aria-label")! == "Play";

        ipcRenderer.send('play-button-changed', isPlaying);
    });

    playButtonObserver.observe(playContent, { attributes: true });
}


// IPC
setTimeout(initializeListeners, 3000);
