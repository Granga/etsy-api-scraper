import {IMethod} from "../interfaces";
export function module(moduleName: string, fieldsInterfaceTS: string, parameterInterfacesTS: string, methodsTS: string, methodNames: string[]) {
    return `
import {IOptions} from "../client/client";
import {IStandardParameters} from "../client/IStandardParameters";
import {IStandardResponse} from "../client/IStandardResponse";
import {request} from "../client/client";

//fields
${fieldsInterfaceTS.trim()}

//parameters types
${parameterInterfacesTS.trim()}

//methods
${methodsTS.trim()}

${methodCollectionExport(moduleName, methodNames).trim()}
`.trim();
}

export function index(moduleNames: string[]) {
    return `
export {IOptions} from "./client/client";
export * from "./client/IStandardParameters";
export * from "./client/IStandardResponse";
${moduleNames.map(m => exportModule(m, "./api")).join("\n")}
`.trim();
}

export function exportModule(moduleName: string, relativePath: string) {
    return `export * from "${relativePath}/${moduleName}";`
}

export function interfaceTemplate(name: string, extendsTS: string, fieldsTS: string) {
    return `
export interface ${name} ${extendsTS} {
    ${fieldsTS}
}`.trim();
}

export function methodTemplate(method: IMethod, parametersInterfaceName: string) {
    return `
/**
* ${method.synopsis}
*/
function ${method.methodName} <TResult>(parameters: ${parametersInterfaceName}, options?: IOptions): Promise<IStandardResponse<${parametersInterfaceName}, TResult>> {
    return request<${parametersInterfaceName}, TResult>("${method.uri}", parameters, "${method.httpMethod}", options);
}`.trim();
}

export function methodCollectionExport(moduleName: string, methodNames: string[]) {
    return `export const ${moduleName} = { ${methodNames.join(", ")} };`
}

