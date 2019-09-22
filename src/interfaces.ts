export interface IEntity {
    name: string,
    fields: IParsedField[],
    methods: IParsedMethod[]
}

export interface ITypescriptFile {
    name: string,
    content: string
}

export interface IParsedField {
    permissionScope: PermissionScope;
    visibilityLevel: Visibility;
    description: string;
    field?: string,
    name?: string,
    required?: string,
    default?: string,
    type: string,
    isDeprecated: boolean,
    deprecatedDescription?: string
}

export interface IParsedMethod {
    docUrl: string,
    methodName: string,
    synopsis: string,
    httpMethod: HttpMethod,
    uri: string,
    parameters: IParsedField[],
    requiresOAuth: string,
    permissionScope: string
}

export type HttpMethod = "GET" | "POST" | "DELETE" | "PUT";

export type Visibility = "public" | "private";

export type PermissionScope = "none" | string;

export interface IApiMethodJson {
    name: string;
    description: string;
    uri: string;
    params: object;
    defaults: object;
    type: string;
    visibility: Visibility;
    http_method: HttpMethod;
}

export interface IParsedModule {
    name: string;
    methods: IParsedMethod[];
    fields: IParsedField[];
}