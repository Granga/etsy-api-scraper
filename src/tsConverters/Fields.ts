import {split, trimEnd} from "lodash";
import {etsyTypesMap} from "../EtsyTypes";
import {IField} from "../interfaces";
import {fieldTemplate} from "./Templates";

export default class Fields {
    static toTypescript(fields: IField[], type: "parameters" | "interface", interfaceName?: string): string {
        let ts = "";
        fields.forEach((field, index) => {
            ts += fieldTemplate(field, index === fields.length - 1);
        });

        if (type == "interface") {
            if (!interfaceName) throw new Error("Must specify interfaceName when creating interface");
            ts = `export interface ${interfaceName} {
    ${ts}
}`;
        }

        return ts;
    }

    static mapType(type: string): string {
        let tsType = etsyTypesMap[type];

        if (tsType) {
            return tsType;
        }

        if (type.startsWith("array")) {
            type = type.match(/array\(([^)]+)\)/)[1];
            let tsType = this.mapType(type);
            if (tsType.indexOf("|") > -1) {
                return `(${tsType})[]`;
            }
            else {
                return `${tsType}[]`;
            }
        }

        else if (type.startsWith("enum")) {
            let values = split(type.match(/enum\(([^)]+)\)/)[1], ",");
            let stringLiteral = "";
            values.forEach(v => {
                v = v.trim();
                stringLiteral += `"${v}"|`;
            });

            return trimEnd(stringLiteral, "|");
        }

        else if (type.startsWith("map")) {
            //todo: Maybe parse the map types in more detail, build interfaces for them, and use those interfaces
            // let values = words(type.match(/map\(([^)]+)\)/)[1]);

            // let keyType = this.mapType(values[0]);
            // let valueType = this.mapType(values[1]);

            let keyType = "any", valueType = "any";

            return `[${keyType}, ${valueType}]`;
        }

        console.log("No implementation for type", type);
        return "any";
    }
}
