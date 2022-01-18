import PlayerModel from './player';

export default class Song extends PlayerModel {
    album: string;
    artist: string;

    constructor(
        id: number,
        title: string,
        listening: boolean,
        image: string | undefined,
        time: number | undefined,
        album: string,
        artist: string
    ) {
        super(id, title, listening, image, time);

        this.album = !album ? 'Unknown Album': album;
        this.artist = !artist ? 'Unknown Artist': artist;
        this.trayMessage = `${this.artist} • ${this.title}`;
        this.notification = `${this.title}\n${this.album}\n${this.artist}`;
    }

    getId(): string {
        return `SONG_${this.id}`;
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

    getButtons(): any[] | undefined {
        if (this.id < 0) return undefined;
        
        return [{ label: 'Play on Deezer', url: `https://www.deezer.com/track/${this.id}` }];
    }
}
