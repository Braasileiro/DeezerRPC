import BaseModel from "./BaseModel";

export default class Album extends BaseModel {

    constructor(name: string, href: string) {
        super(name, href);
    }
}
