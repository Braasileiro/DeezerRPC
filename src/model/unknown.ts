import { APP } from '../app/app';
import PlayerModel from './player';

export default class Unknown extends PlayerModel {
    constructor(
        id: string,
        title: string,
        listening: boolean,
        image: string | undefined,
        time: number | undefined,
    ) {
        super(id, title, listening, image, time);

        this.statusKey = undefined;
        this.statusText = undefined;
        this.trayMessage = APP.name;
        this.notification = 'Unknown';
    }

    getState(): string {
        return 'Unknown State';
    }

    getStartTimestamp(): number | undefined {
        return undefined;
    }

    getEndTimestamp(): number | undefined {
        return undefined;
    }

    getImageText(): string {
        return APP.name;
    }
}
