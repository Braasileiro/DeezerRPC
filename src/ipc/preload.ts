import dayjs from 'dayjs';
import IPCSong from './model/song';
import { ipcRenderer } from 'electron';

function initializeListeners() {
    setInterval(function () {
        const songContent = document.querySelector('div.marquee-content')?.querySelectorAll('a.track-link');
        const isListening = !(document.querySelector('button.svg-icon-group-btn.is-highlight > svg > g > path')?.outerHTML == '<path d="m5 2 18 10L5 22V2z"></path>');

        if (songContent != null && songContent.length > 0) {
            ipcRenderer.send('song-changed', new IPCSong(
                songContent[0].textContent!,
                songContent[1].textContent!,
                timestamp(),
                isListening
            ));

            return;
        }

        const queueContent = document.querySelector('div.queuelist-cover-title');

        if (queueContent != null) {
            ipcRenderer.send('song-changed', new IPCSong(
                queueContent.textContent!,
                document.querySelector('div.queuelist-cover-subtitle')?.textContent!,
                timestamp(),
                isListening
            ));

            return;
        }

        const customContent = document.querySelector('div.marquee-content')?.textContent?.split(" · ");

        if (customContent != null) {
            ipcRenderer.send('song-changed', new IPCSong(
                customContent[0],
                customContent[1],
                timestamp(),
                isListening
            ));
        }
    }, 5000)
}

function timestamp(): number | undefined {
    const sMax = document.querySelector('div.slider-counter.slider-counter-max')!.textContent;
    const sCurrent = document.querySelector('div.slider-counter.slider-counter-current')!.textContent;

    if (!sMax || !sCurrent) return undefined;

    return dayjs(Date.now())
        .add(parseInt(sMax?.substring(0, 2)), 'm')
        .add(parseInt(sMax?.substring(3)), 's')
        .subtract(parseInt(sCurrent?.substring(0, 2)), 'm')
        .subtract(parseInt(sCurrent?.substring(3)), 's')
        .unix();
}


// IPC
setTimeout(initializeListeners, 3000);
