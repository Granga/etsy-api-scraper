import * as _ from "lodash";
import {HttpMethod, IApiMethodJson, IParsedMethod, Visibility} from "../interfaces";
import {Templates} from "../tsConverters/Templates";
import {Interface} from "./Interface";
import {MethodType} from "./MethodType";
import {Parameter} from "./Parameter";

export class Method {
    name: string;
    description: string;
    uri: string;
    params: Parameter[];
    defaults: object;
    type: MethodType;
    visibility: Visibility;
    http_method: HttpMethod;

    //extended
    module: string;
    docUrl: string;
    synopsis: string;
    requiresOAuth: string;
    permissionScope: string;

    parametersInterface: Interface;

    constructor(method: IApiMethodJson) {
        this.name = method.name;
        this.description = method.description;
        this.uri = method.uri;
        this.params = this.mapParameters(method.params, method.defaults);
        this.defaults = method.defaults;
        this.type = new MethodType(method.type);
        this.visibility = method.visibility;
        this.http_method = method.http_method;

        this.parametersInterface = new Interface(this.params, `${this.name}Parameters`, ["IStandardParameters"]);
    }

    private mapParameters(params: object, defaults: any) {
        return _.keys(params)
            .filter(p => ["limit", "offset", "api_key"].indexOf(p) == -1)
            .map(key => {
                if (defaults) {
                    return new Parameter(key, params[key], defaults[key]);
                }
                else {
                    return new Parameter(key, params[key]);
                }
            });
    }

    toString() {
        return Templates.method(this)
    }

    extend(htmlMethod: IParsedMethod) {
        this.docUrl = htmlMethod.docUrl;
        this.synopsis = htmlMethod.synopsis;
        this.requiresOAuth = htmlMethod.requiresOAuth;
        this.permissionScope = htmlMethod.permissionScope;
    }
}