import { APP } from '../app/app';
import PlayerModel from './player';

export default class Radio extends PlayerModel {
    state: string;

    constructor(
        id: string,
        title: string,
        listening: boolean,
        streaming: boolean,
        image: string | undefined,
        time: number | undefined
    ) {
        super(id, title, listening, streaming, image, time);

        this.state = 'Radio';
        this.trayMessage = `Radio • ${this.title}`;
        this.notification = `${this.title}\nRadio`;
    }

    getState(): string {
        return this.state;
    }

    getStartTimestamp(): number | undefined {
        return this.time;
    }

    getEndTimestamp(): number | undefined {
        return undefined;
    }

    getImageText(): string {
        return APP.name;
    }
}
