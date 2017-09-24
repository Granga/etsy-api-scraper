import {camelCase, upperFirst} from "lodash";
import MethodsParser from "./MethodsParser";
import FieldsParser from "./FieldsParser";
import {IParsedModule} from "../interfaces";

export default class ModuleParser {
    static parseName($: CheerioStatic): string {
        return upperFirst(camelCase($(".docs-content h1").text()));
    }

    static parseModule($: CheerioStatic) {
        let name = this.parseName($);
        let methods = MethodsParser.parse($);
        let fields = FieldsParser.parse($, $("#resource_fields").get(0));

        return {
            name,
            methods,
            fields
        } as IParsedModule;
    }
}
