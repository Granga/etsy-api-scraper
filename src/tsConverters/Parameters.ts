import {IMethod} from "../interfaces";
import Fields from "./Fields";
import {upperFirst} from "lodash";

export default class Parameters {
    static toTypescript(methodOrMethods: IMethod | IMethod[], interfaceName?: string): string {
        if (Array.isArray(methodOrMethods)) {
            let methods = methodOrMethods as IMethod[];
            return methods.reduce<string>((val, method) => val + this.toTypescript(method, `I${upperFirst(method.methodName)}`), "");
        }
        else {
            let method = methodOrMethods as IMethod;
            return Fields.toTypescript(method.parameters, "interface", interfaceName);
        }
    }
}
