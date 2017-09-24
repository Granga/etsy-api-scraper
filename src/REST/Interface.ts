import {Templates} from "../tsConverters/Templates";
import {Parameter} from "./Parameter";
import {Property} from "./Property";
import _ = require("lodash");

export class Interface {
    fields: Parameter[] | Property[];
    name: string;
    extendedBy: string[];

    constructor(fields: Parameter[] | Property[], name: string, extendedBy?: string[]) {
        this.fields = fields;
        this.name = `I${_.upperFirst(name)}`;
        this.extendedBy = extendedBy;
    }

    toString() {
        if (this.extendedBy && this.extendedBy.length > 0) {
            return Templates.extendedInterface(this);
        }
        else {
            return Templates.interface(this);
        }
    }

    get body() {
        return (this.fields as { toString(): string }[])
            .map(property => property.toString())
            .join(",");
    }
}