export default class IPCSong {
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
