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
import { AxiosResponse } from "axios";
import { ApiRequest } from "../client/ApiRequest";
import { IOptions, IRequestOptions, IStandardParameters, IStandardResponse } from "../types";

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
import { IOptions } from "../types";
${moduleNames.map(m => importEntityClass(m, "../api")).join("\n")}

export class Etsy {
    constructor(
        private readonly options: IOptions
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
    return `${entityName} = new ${entityName}(this.options);`
}

export function interfaceTemplate(name: string, body: string) {
    return `
export interface ${name} {
    ${body}
}`.trim();
}

export function methodClassTemplate(name: string, methodsTS: string) {
    return `export class ${name} extends ApiRequest { 
    constructor(
        options: IOptions
    ) {
        super(options);
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
async ${method.methodName} <TResult>(
    params: ${specificParams} & IStandardParameters,
    extra?: IRequestOptions
): Promise<AxiosResponse<IStandardResponse<${specificParams}, TResult>>> {
    return this.request<${specificParams}, TResult>("${method.httpMethod}", "${method.uri}", params, extra);
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

