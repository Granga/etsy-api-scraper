import { IField, IMethod } from "../interfaces";
import Fields from "./Fields";

export function module(
    moduleName: string,
    fieldsInterfaceTS: string,
    parameterInterfacesTS: string,
    methodsClassTS: string,
    methodNames: string[]
) {
    return `
import {AxiosRequestConfig, AxiosResponse } from "axios";
import {IOAuthTokens} from "../types/IOAuthTokens";
import {IStandardParameters} from "../types/IStandardParameters";
import {IStandardResponse} from "../types/IStandardResponse";
import {Token} from "oauth-1.0a";
import {request} from "../client/Request";

//fields
${fieldsInterfaceTS.trim()}

//parameters types
${parameterInterfacesTS.trim()}

//methods class
${methodsClassTS.trim()}
`.trim();
}

export function entities(moduleNames: string[]) {
    return `
import { AxiosRequestConfig } from "axios";
import { Token } from "oauth-1.0a";
${moduleNames.map(m => importEntityClass(m, "../api")).join("\n")}

export class Entities {
    constructor(
        private axiosConfig: AxiosRequestConfig,
        private apiKeys: Token
    ) {
    }

    ${moduleNames.map(m => createEntityInstanceAsProperty(m)).join("\n")}
}
`.trim();
}

export function apiIndex(moduleNames: string[]) {
    return `
import { AxiosRequestConfig } from "axios";
import { Token } from "oauth-1.0a";
${moduleNames.map(m => importEntityClass(m, "../api")).join("\n")}

export class Entities {
    constructor(
        private axiosConfig: AxiosRequestConfig,
        private apiKeys: Token
    ) {
    }

    ${moduleNames.map(m => createEntityInstanceAsProperty(m)).join("\n")}
}
`.trim();
}

export function importEntityClass(moduleName: string, relativePath: string) {
    return `import {${moduleName}} from "${relativePath}/${moduleName}";`
}

export function createEntityInstanceAsProperty(entityName: string) {
    return `${entityName} = new ${entityName}(this.axiosConfig, this.apiKeys);`
}

export function interfaceTemplate(name: string, body: string) {
    return `
export interface ${name} {
    ${body}
}`.trim();
}

export function methodClassTemplate(name: string, methodsTS: string) {
    return `export class ${name} { 
    constructor(
        private readonly config: AxiosRequestConfig,
        private readonly apiKeys: Token
    ) {
    }
    
    ${methodsTS}
}
`.trim();
}

export function methodTemplate(method: IMethod, specificParams: string) {
    return `
/**
* ${method.synopsis}
*/
async ${method.methodName} <TResult>(params: ${specificParams} & IStandardParameters, options ?: (IOAuthTokens & { axiosConfig?: AxiosRequestConfig })): Promise<AxiosResponse<IStandardResponse<${specificParams}, TResult>>> {
    return request<${specificParams}, TResult>({ ...this.config, ...options?.axiosConfig, url: "${method.uri}", method: "${method.httpMethod}" }, params, {...{apiKeys: this.apiKeys}, ...options});
}`.trim();
}

export function fieldTemplate(field: IField, isLast: boolean) {
    let description = field.description ? `\n* ${field.description}` : "";
    let deprecation = field.isDeprecated ? `\n@deprecated ${field.deprecatedDescription || ""}` : "";

    let comment = description.length > 0 || deprecation.length > 0
        ? `/**${deprecation}${description}\n*/\n`
        : "";

    return `${comment}${field.field || field.name}${field.required == "N" ? '?' : ''}: ${Fields.mapType(field.type)}${isLast ? '' : ',\n'}`;
}

