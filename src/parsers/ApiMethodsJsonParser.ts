import {IApiMethodJson} from "../interfaces";
import {Method} from "../REST/Method";

export class ApiMethodsJsonParser {
    static parse(json: {
        count: number,
        results: IApiMethodJson[],
        params: null;
        type: string;
        pagination: any;
    }): Method[] {
        return json.results.map(m => new Method(m));
    }
}