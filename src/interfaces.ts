export interface IEntity {
    name: string,
    fields: IField[],
    methods: IMethod[]
}

export interface ITypescriptFile {
    name: string,
    content: string
}

export interface IField {
    field?: string,
    name?: string,
    required: string,
    default: string,
    type: string
}

export interface IMethod {
    docUrl: string,
    methodName: string,
    synopsis: string,
    httpMethod: string,
    uri: string,
    parameters: IField[],
    requiresOAuth: string,
    permissionScope: string
}
