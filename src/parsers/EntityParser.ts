import {camelCase, upperFirst} from "lodash";

export default class EntityParser {
    static parseName($: CheerioStatic): string {
        return upperFirst(camelCase($(".docs-content h1").text()));
    }
}
