import {IField, IMethod} from "../interfaces";
import Fields from "./Fields";
import * as templates from "./Templates";
import _ = require("lodash");

export default class ApiModule {

    static toTypescript(name: string, fields: IField[], methods: IMethod[]) {

        let fieldsTS = Fields.toTypescript(fields, "parameters");
        let fieldsInterface = templates.interfaceTemplate(`I${name}`, "", fieldsTS);

        let methodsTS = methods.reduce<string>((ts, method) => {
            let parametersInterfaceName = this.toInterfaceName(method.methodName);

            return ts + "\n" + templates.methodTemplate(method, parametersInterfaceName);
        }, "");

        let parameterInterfacesTS = methods.reduce<string>((ts, method) => {
            let parametersInterfaceName = this.toInterfaceName(method.methodName);
            let fieldsTS = Fields.toTypescript(method.parameters, "parameters");

            return ts + "\n" + templates.interfaceTemplate(parametersInterfaceName, "extends IStandardParameters", fieldsTS);
        }, "");

        let classTS = templates.module(name, fieldsInterface, parameterInterfacesTS, methodsTS, methods.map(m => m.methodName));

        return classTS;
    }

    private static toInterfaceName(name: string) {
        return `I${_.upperFirst(_.camelCase(name))}Parameters`;
    }

}
