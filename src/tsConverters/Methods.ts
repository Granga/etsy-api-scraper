import {IMethod} from "../interfaces";
import Fields from "./Fields";
import {upperFirst} from "lodash";

export default class Methods {
    static toTypescript(methods: IMethod[]): string {
        let parameterInterfacesTS = methods.reduce<string>((ts, method) => ts + Fields.toTypescript(method.parameters, "interface", `${this.createParametersInterfaceName(method.methodName)} extends IStandardParameters`), "");
        let methodsTS = methods.reduce<string>((ts, method) => ts + this.methodToTS(method), "");

        return `${parameterInterfacesTS}\n${methodsTS}`;
    }

    private static methodToTS(method: IMethod) {
        let parametersInterfaceName = this.createParametersInterfaceName(method.methodName);

        let doc = this.createJsDoc(method);

        return `${doc}\n` +
            `export function ${method.methodName}<TResult>(parameters: ${parametersInterfaceName}): Bluebird<IStandardResponse<TResult, ${parametersInterfaceName}>> {\n` +
            `    return request<IStandardResponse<TResult, ${parametersInterfaceName}>>(parameters, '${method.uri}',  '${method.httpMethod}');\n` +
            `}`;

    }

    private static createJsDoc(method: IMethod) {
        let docText =
            `\n/**\n` +
            `* ${method.synopsis}\n` +
            `*/`;

        return docText;
    }

    private static createParametersInterfaceName(methodName: string) {
        return `I${upperFirst(methodName)}Parameters`;
    }
}
