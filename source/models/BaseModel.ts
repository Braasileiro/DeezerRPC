import Settings from "../settings";

export default class BaseModel {
    name: string;
    href: string;

    constructor(name: string, href: string) {
        this.name = name;
        this.href = href;
    }

    public toString = (): string => {
        return `${this.name} <${Settings.DeezerUrl}${this.href}>`;
    }
}
