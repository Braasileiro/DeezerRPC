import PlayerModel from './player';

export default class Song extends PlayerModel {
    album: string;
    artist: string;

    constructor(
        id: string,
        title: string,
        listening: boolean,
        streaming: boolean,
        image: string | undefined,
        time: number | undefined,
        album: string,
        artist: string
    ) {
        super(id, title, listening, streaming, image, time);

        this.album = !album ? 'Unknown Album': album;
        this.artist = !artist ? 'Unknown Artist': artist;
        this.trayMessage = `${this.artist} • ${this.title}`;
        this.notification = `${this.title}\n${this.album}\n${this.artist}`;
    }

    getState(): string {
        return this.artist;
    }

    getStartTimestamp(): number | undefined {
        return undefined;
    }

    getEndTimestamp(): number | undefined {
        return this.time;
    }

    getImageText(): string {
        return this.album;
    }
}
