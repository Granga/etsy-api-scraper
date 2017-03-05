import {IMethod} from "../interfaces";
export function classTemplate(name: string, fieldsInterfaceTS: string, parameterInterfacesTS: string, methodsTS: string) {
    return `import {IStandardParameters} from "../client/IStandardParameters";
import {EtsyApiClient} from "../client/EtsyApiClient";
import {IStandardResponse} from "../client/IStandardResponse";

${fieldsInterfaceTS}

${parameterInterfacesTS}

export class ${name} {
    constructor(private client: EtsyApiClient) {

    }

    ${methodsTS}
}`;
}

export function interfaceTemplate(name: string, extendsTS: string, fieldsTS: string) {
    return `export interface ${name} ${extendsTS} {
    ${fieldsTS}
}`;
}

export function methodTemplate(method: IMethod, parametersInterfaceName: string) {
    return `/**
* ${method.synopsis}
*/
${method.methodName}<TResult>(parameters: ${parametersInterfaceName}): Promise<IStandardResponse<${parametersInterfaceName}, TResult>> {
    return this.client.http<${parametersInterfaceName}, TResult>("${method.uri}", parameters, "${method.httpMethod}");
}`;
}

export function clientGetterTemplate(name: string) {
    return `private _${name}: ${name};
get ${name}(): ${name} {
    return this._${name} || (this._${name} = new ${name}(this));
}`
}

