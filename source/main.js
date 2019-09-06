const settings = require('./settings');
const { app, BrowserWindow } = require('electron');

var mainWindow;
var splashWindow;

function createWindow(visibility) {
    return new BrowserWindow({
        width: settings.WindowWidth,
        height: settings.WindowHeight,
        show: visibility,
        title: 'DeezerRPC',
    });
}

function createSplashWindow() {
    splashWindow = createWindow(true);

    splashWindow.loadURL(`file://${__dirname}/views/splash.html`)
}

function createMainWindow() {
    mainWindow = createWindow(false);

    mainWindow.loadURL(settings.DeezerUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.webContents.session.cookies.get({}, cookies => {
            let arl = cookies.find(key => key.name == "arl");

            if (!arl) {
                mainWindow.loadURL(settings.DeezerOAuthUrl + '?app_id=' + settings.DeezerApplicationID + '&redirect_uri=' + settings.DeezerUrl);
            }

            splashWindow.close();
            mainWindow.show();
        });
    });

    setTimeout(getCurrentSong, 7000);

    createSplashWindow();
}

function getCurrentSong() {
    retrieveDocument('document.querySelector("div.marquee-content").innerHTML').then(function (response) {
        console.log(response);
    });
}

function retrieveDocument(query) {
    return new Promise(function (resolve, reject) {
        mainWindow.webContents.executeJavaScript(query, function (result) {
            resolve(result);
        });
    });
}

app.on('ready', createMainWindow);
