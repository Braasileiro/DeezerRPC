export default class Song {
    name: string;
    artist: string;
    time: number;

    constructor(name: string, artist: string, time: number) {
        this.name = name;
        this.artist = artist;
        this.time = time;
    }
}
