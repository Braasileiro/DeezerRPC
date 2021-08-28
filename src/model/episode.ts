import { APP } from '../app/app';
import PlayerModel from './player';

export default class Episode extends PlayerModel {
    name: string;
    description: string;

    constructor(
        id: string,
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
}
