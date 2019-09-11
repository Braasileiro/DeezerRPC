import Album from "./Album";
import Artist from "./Artist";

export default class Song {
    name: string;
    album: Album;
    artists: Artist[];

    constructor(name: string, album: Album, artists: Artist[]) {
        this.name = name;
        this.album = album;
        this.artists = artists;
    }

    public toString = (): string => {
        return `${this.name} | ${this.album.toString()} | ${this.artists.map(value => value.toString()).toString()}`;
    }
}
