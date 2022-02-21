import { APP } from '../app/app';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

export function createWindow(visibility: boolean, params?: BrowserWindowConstructorOptions): BrowserWindow {
    let options: Electron.BrowserWindowConstructorOptions = {
        width: APP.settings.windowWidth,
        height: APP.settings.windowHeight,
        show: visibility,
        title: APP.name
    };

    if (params) options = Object.assign(options, params);

    let window = new BrowserWindow(options);

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
