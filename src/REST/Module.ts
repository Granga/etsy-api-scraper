import {Interface} from "./Interface";
import {Method} from "./Method";
import {Parameter} from "./Parameter";
import {Templates} from "../tsConverters/Templates";
import {IParsedField} from "../interfaces";
import {Property} from "./Property";

export class Module {
    name: string;
    properties: Property[];
    methods: Method[];

    propertiesInterface: Interface;

    constructor(name: string, fields: IParsedField[]) {
        this.name = name;
        this.properties = fields.map(field => new Property(field));
        this.methods = [];

        this.propertiesInterface = new Interface(this.properties, this.name);
    }

    toString() {
        return Templates.module(this)
    }
}