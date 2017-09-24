export class MethodType {
    etsyType: string;

    constructor(etsyType: string) {
        this.etsyType = etsyType;
    }

    get toString(): string {
        return this.convertType();
    }

    private convertType() {
        switch (this.etsyType) {
            case "Int":
                return "number";

            default:
                console.warn("Unable to convert method's etsyType to tsType.");
                return "any";
        }
    }
}