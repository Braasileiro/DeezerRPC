import { Client } from 'discord-rpc';
import Configstore from 'configstore';

const PACKAGE = require('../../package.json');

// App
export const APP = {
    name: 'DeezerRPC',
    version: PACKAGE.version,
    homepage: PACKAGE.homepage,
    packageUrl: 'https://raw.githubusercontent.com/Braasileiro/DeezerRPC/master/package.json',
    appId: 'com.brasileiro.deezerrpc',
    settings: {
        windowWidth: 1280,
        windowHeight: 720,
        deezerUrl: 'https://www.deezer.com/login',
        discordClientID: ''
    },
    preferences: {
        closeToTray: 'closeToTray',
        minimizeToTray: 'minimizeToTray',
        checkUpdates: 'checkUpdates'
    },
};

export const APP_CONFIG = new Configstore(
    PACKAGE.name, {
        closeToTray: false,
        minimizeToTray: false,
        checkUpdates: true
    }
);

// RPC
export const RPC = new Client({
    transport: 'ipc'
});
