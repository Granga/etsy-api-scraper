import {TypesMap} from "../TypesMap";

export class ParameterType {
    etsyType: string;

    constructor(etsyType: string) {
        this.etsyType = etsyType;
    }

    toString(): string {
        return this.convertType();
    }

    private convertType() {
        return TypesMap.get(this.etsyType);
    }
}