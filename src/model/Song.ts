export default class Song {
    name: string;
    artist: string;
    time: number;
    listening: boolean;

    constructor(name: string, artist: string, time: number, listening: boolean = true) {
        this.name = name;
        this.artist = artist;
        this.time = time;
        this.listening = listening;
    }
}
