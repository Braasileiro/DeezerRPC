import { JSDOM } from "jsdom";
import Settings from './settings';
import { app, BrowserWindow } from 'electron';

import Song from './models/Song';
import Album from './models/Album';
import Artist from './models/Artist';

var mainWindow: BrowserWindow;
var splashWindow: BrowserWindow;


// Main
function createWindow(visibility: boolean) {
    return new BrowserWindow({
        width: Settings.WindowWidth,
        height: Settings.WindowHeight,
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

    mainWindow.loadURL(Settings.DeezerUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.webContents.session.cookies.get({name: "arl"}, function(arl) {
            if (!arl) {
                mainWindow.loadURL(Settings.DeezerOAuthUrl + '?app_id=' + Settings.DeezerApplicationID + '&redirect_uri=' + Settings.DeezerUrl);
            }

            splashWindow.close();
            mainWindow.show();
        });
    });

    setTimeout(getCurrentSong, 7000);

    createSplashWindow();
}

async function getCurrentSong(): Promise<Song> {
    let response = await retrieveDocument('document.querySelector("div.marquee-content").innerHTML');

    let selector = response.querySelectorAll("a.track-link");

    let album = new Album("", retrieveAttribute(selector[0], "href"));

    let artists: Artist[] = [];

    selector.forEach((value, index) => {
        if (index == 0) return;

        artists.push(new Artist(retrieveTextContent(value), retrieveAttribute(value, "href")));
    });

    let song =  new Song(retrieveTextContent(selector[0]), album, artists);

    console.log(song.toString());

    return song;
}


// Selector
async function retrieveDocument(query: string): Promise<Document> {
    let result = await mainWindow.webContents.executeJavaScript(query);

    return new JSDOM(result).window.document;
}

function retrieveAttribute(element: Element, attr: string): string {
    return element.getAttribute(attr) || "";
}

function retrieveTextContent(element: Element): string {
    return element.textContent || "";
}


// Initialize Trigger
app.on('ready', createMainWindow);
