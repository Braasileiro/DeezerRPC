import { ipcRenderer } from 'electron';

setTimeout(overrideListeners, 3000);

function overrideListeners() {

    const bottomPlay = document.querySelector("button.svg-icon-group-btn.is-highlight");

    const observer = new MutationObserver(() => {
        alert('BottomPlay');
    });

    if (bottomPlay) {
        observer.observe(bottomPlay, { attributes: true });
    }
}
