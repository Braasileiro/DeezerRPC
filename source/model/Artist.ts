import BaseModel from "./BaseModel";

export default class Artist extends BaseModel {

    constructor(name: string, href: string) {
        super(name, href);
    }
}
