import path from 'path';
import Settings from './settings';
import { app, BrowserWindow } from 'electron';

var mainWindow: BrowserWindow;
var splashWindow: BrowserWindow;


// Main
function createWindow(visibility: boolean) {
    return new BrowserWindow({
        width: Settings.WindowWidth,
        height: Settings.WindowHeight,
        show: visibility,
        title: 'DeezerRPC',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
}

function createSplashWindow() {
    splashWindow = createWindow(true);

    splashWindow.loadURL(`file://${__dirname}/view/splash.html`)
}

function createMainWindow() {
    mainWindow = createWindow(false);

    mainWindow.loadURL(Settings.DeezerUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.webContents.session.cookies.get({name: "arl"}, (arl) => {
            if (!arl) {
                mainWindow.loadURL(Settings.DeezerOAuthUrl + '?app_id=' + Settings.DeezerApplicationID + '&redirect_uri=' + Settings.DeezerUrl);
            }

            mainWindow.show();
            splashWindow.close();
        });
    });

    createSplashWindow();
}


// Initialize Trigger
app.on('ready', createMainWindow);
