import { ipcRenderer } from 'electron';

function songListener() {

    const bottomPlay = document.querySelector("button.svg-icon-group-btn.is-highlight")!;

    const observer = new MutationObserver(() => {
        ipcRenderer.send('song-changed', 'BottomPlay');
    });
    
    observer.observe(bottomPlay, { attributes: true });
}


// IPC
setTimeout(songListener, 3000);
