import { APP } from '../app/app';
import { BrowserWindow } from 'electron';

export function create(visibility: boolean, preload?: string) {
    let window: BrowserWindow;

    if (preload) {
        window = new BrowserWindow({
            width: APP.settings.windowWidth,
            height: APP.settings.windowHeight,
            show: visibility,
            title: APP.name,
            webPreferences: {
                preload: preload
            }
        });
    } else {
        window = new BrowserWindow({
            width: APP.settings.windowWidth,
            height: APP.settings.windowHeight,
            show: visibility,
            title: APP.name
        });
    }

    window.setMenu(null);

    return window;
}

export function userAgent(): string {
    switch (process.platform) {
        case 'linux':
            return 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'

        case 'darwin':
            return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_5_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'

        // win32
        default:
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }
}
