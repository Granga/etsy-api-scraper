import {IParsedField, PermissionScope, Visibility} from "../interfaces";
import {ParameterType} from "./ParameterType";
import {Templates} from "../tsConverters/Templates";

export class Property {
    name: string;
    type: ParameterType;
    defaultValue?: any;

    description: string;
    visibilityLevel: Visibility;
    permissionScope: PermissionScope;

    //extended
    required: string;

    constructor(property: IParsedField) {
        this.name = property.field;
        this.type = new ParameterType(property.type);
        this.defaultValue = property.default;

        this.description = property.description;
        this.visibilityLevel = property.visibilityLevel;
        this.permissionScope = property.permissionScope;
    }

    toString() {
        return Templates.property(this);
    }
}