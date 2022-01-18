import { APP } from '../app/app';
import PlayerModel from './player';

export default class Episode extends PlayerModel {
    name: string;
    description: string;

    constructor(
        id: number,
        title: string,
        listening: boolean,
        image: string | undefined,
        time: number | undefined,
        name: string,
        description: string
    ) {
        super(id, title, listening, image, time);

        this.name = name;
        this.description = description
        this.trayMessage = `${this.name} • ${this.title}`;
        this.notification = `${this.title}\n${this.name}`;
    }

    getId(): string {
        return `EPISODE_${this.id}`;
    }

    getState(): string {
        return this.name;
    }

    getStartTimestamp(): number | undefined {
        return undefined;
    }

    getEndTimestamp(): number | undefined {
        return this.time;
    }

    getImageText(): string {
        return APP.name;
    }

    getButtons(): any[] | undefined {
        if (this.id < 0) return undefined;
        
        return [{ label: 'Play on Deezer', url: `https://www.deezer.com/episode/${this.id}` }];
    }
}
