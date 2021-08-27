export class IPCSong {
    name: string;
    artist: string;
    listening: boolean;
    time: number | undefined;
    description: string;
    imageKey: string;
    status: string;

    constructor(name: string, artist: string, time: number | undefined, listening: boolean = true) {
        this.name = !name ? 'Unknown Song' : name;
        this.artist = !artist ? 'Unknown Artist': artist;
        this.listening = listening;
        this.time = time;
        this.description = `${this.name}\n${this.artist}`;
        this.imageKey = this.listening ? 'listening' : 'paused';
        this.status = this.listening ? 'Listening' : 'Paused';
    }
}

export class Song {
    title: string;
    album: string;
    artist: string;
    listening: boolean;
    hash: string;
    cover: string | undefined;
    time: number | undefined;
    trayMessage: string;
    description: string;
    imageKey: string;
    status: string;

    constructor(title: string, album: string, artist: string, listening: boolean, hash: string, cover: string | undefined, time: number | undefined) {
        this.title = !title ? 'Unknown Song' : title;
        this.album = !album ? 'Unknown Album': album;
        this.artist = !artist ? 'Unknown Artist': artist;
        this.listening = listening;
        this.hash = hash;
        this.cover = cover;
        this.time = time;

        this.trayMessage = `${this.artist} • ${this.title}`;
        this.description = `${this.title}\n${this.album}\n${this.artist}`;
        this.imageKey = this.listening ? 'listening' : 'paused';
        this.status = this.listening ? 'Listening' : 'Paused';
    }
}
