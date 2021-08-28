export default abstract class PlayerModel {
    id: string;
    title: string;
    listening: boolean;
    image: string | undefined;
    time: number | undefined;

    statusKey: string;
    statusText: string;
    trayMessage: string = '';
    notification: string = '';

    constructor(
        id: string,
        title: string,
        listening: boolean,
        image: string | undefined,
        time: number | undefined
    ) {
        this.id = id;
        this.title = !title ? 'Unknown' : title;
        this.listening = listening;
        this.image = image;
        this.time = time;
        this.statusKey = this.listening ? 'listening' : 'paused';
        this.statusText = this.listening ? 'Listening' : 'Paused';
    }

    abstract getState(): string;
    abstract getStartTimestamp(): number | undefined;
    abstract getEndTimestamp(): number | undefined;
    abstract getImageText(): string;
}
