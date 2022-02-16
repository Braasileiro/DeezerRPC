import { APP } from '../app/app';
import { BrowserWindow } from 'electron';

export function create(visibility: boolean, preload?: string) {
    let options = {
        width: APP.settings.windowWidth,
        height: APP.settings.windowHeight,
        show: visibility,
        title: APP.name
    };

    if (preload) {
        console.log(preload);
        options = Object.assign(options, {
            webPreferences: {
                preload: preload,
                enableRemoteModule: true,
            },
            titleBarStyle: 'hidden',
        });
    }
    let window = new BrowserWindow(options);

    window.on('enter-full-screen', () => {
        window.webContents.send('window-fullscreen', true)
    });

    window.on('leave-full-screen', () => {
        window.webContents.send('window-fullscreen', false)
    });

    window.on('focus', () => {
        window.webContents.send('window-focus', true)
    });

    window.on('blur', () => {
        window.webContents.send('window-focus', false)
    });

    window.setMenu(null);

    return window;
}

export function userAgent(): string {
    switch (process.platform) {
        case 'linux':
            return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'

        case 'darwin':
            return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'

        // win32
        default:
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
    }
}
