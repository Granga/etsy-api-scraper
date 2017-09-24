import {IParsedField} from "../interfaces";
import {Templates} from "../tsConverters/Templates";
import {ParameterType} from "./ParameterType";

export class Parameter {
    name: string;
    type: ParameterType;
    defaultValue?: any;

    //extended
    required: boolean;

    constructor(name: string, type: string, defaultValue?: any) {
        this.name = name;
        this.type = new ParameterType(type);
        this.defaultValue = defaultValue;
    }

    toString() {
        return Templates.parameter(this);
    }

    extend(htmlParameter: IParsedField) {
        if (htmlParameter) {
            this.required = htmlParameter.required == "Y";
        }
    }
}