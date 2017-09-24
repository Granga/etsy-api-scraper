import {Interface} from "../REST/Interface";
import {Method} from "../REST/Method";
import {Module} from "../REST/Module";
import {Parameter} from "../REST/Parameter";
import {Property} from "../REST/Property";

export class Templates {
    static module(module: Module) {
        return `
        import {IOptions} from "../client/client";
        import {IStandardParameters} from "../client/IStandardParameters";
        import {IStandardResponse} from "../client/IStandardResponse";
        import {request} from "../client/client";
        
        ${module.propertiesInterface.toString()}
        
        ${module.methods.map(method => method.parametersInterface.toString()).join("\n")}
        
        ${module.methods.map(method => method.toString()).join("\n")}
        
        export const ${module.name} = { ${module.methods.map(method => method.name).join(",")} };
        `;
    }

    static index(moduleNames: string[]) {
        return `
export {IOptions} from "./client/client";
export * from "./client/IStandardParameters";
export * from "./client/IStandardResponse";
${moduleNames.map(m => this.exportModule(m, "./api")).join("\n")}
`.trim();
    }

    static exportModule(moduleName: string, relativePath: string) {
        return `export * from "${relativePath}/${moduleName}";`
    }

    static interface(iface: Interface) {
        return `
        export interface ${iface.name} {
            ${iface.body}
        }
        `;
    }

    static extendedInterface(iface: Interface) {
        return `
        export interface ${iface.name} extends ${iface.extendedBy.join(",")} {
            ${iface.body}
        }
        `;
    }

    static method(method: Method) {
        return `
        /**
        * ${method.description}
        */
        function ${method.name} <TResult>(parameters: ${method.parametersInterface.name}, options?: IOptions): Promise<IStandardResponse<${method.parametersInterface.name}, TResult>> {
            return request<${method.parametersInterface.name}, TResult>("${method.uri}", parameters, "${method.http_method}", options);
        }`;
    }


    static parameter(parameter: Parameter) {
        return `${parameter.name}${parameter.required ? "" : "?"}: ${parameter.type.toString()}`;
    }

    static property(property: Property) {
        return `
        /**
        * ${property.description}
        * visibilityLevel: ${property.visibilityLevel}
        * permissionScope: ${property.permissionScope}
        */
        ${property.name}: ${property.type.toString()}
        `;
    }
}

