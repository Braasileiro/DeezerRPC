import moment from 'moment'
import Song from './model/Song';
import { ipcRenderer } from 'electron';


function initializeListeners() {
    setInterval(function () {
        const songContent = document.querySelector("div.marquee-content")?.querySelectorAll("a.track-link")
        const isListening = document.querySelector("button.svg-icon-group-btn.is-highlight")?.querySelector("svg.svg-icon.svg-icon-pause") != null

        if (songContent != null && songContent.length > 0) {
            ipcRenderer.send('song-changed', new Song(
                songContent[0].textContent!,
                songContent[1].textContent!,
                timestamp(),
                isListening
            ));

            return;
        }

        const queueContent = document.querySelector("div.queuelist-cover-title")

        if (queueContent != null) {
            ipcRenderer.send('song-changed', new Song(
                queueContent.textContent!,
                document.querySelector("div.queuelist-cover-subtitle")?.textContent!,
                timestamp(),
                isListening
            ));

            return;
        }

        const customContent = document.querySelector("div.marquee-content")?.textContent?.split(" · ");

        if (customContent != null) {
            ipcRenderer.send('song-changed', new Song(
                customContent[0],
                customContent[1],
                timestamp(),
                isListening
            ));
        }
    }, 5000)
}

function timestamp(): number {
    const sMax = document.querySelector("div.slider-counter.slider-counter-max")!.textContent
    const sCurrent = document.querySelector("div.slider-counter.slider-counter-current")!.textContent

    return moment(Date.now())
        .add(sMax?.substring(0, 2), "m")
        .add(sMax?.substring(3), "s")
        .subtract(sCurrent?.substring(0, 2), "m")
        .subtract(sCurrent?.substring(3), "s")
        .unix();
}


// IPC
setTimeout(initializeListeners, 3000);
