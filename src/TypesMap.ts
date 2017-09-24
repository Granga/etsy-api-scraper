export class TypesMap {
    static typesMap: object = {
        "string": "string",
        "int": "number",
        "epoch": "number",
        "float": "number",
        "boolean": "boolean",
        "user_id_or_name": "string | number",
        "shop_id_or_name": "string | number",
        "team_id_or_name": "string | number",
        "treasury_description": "string",
        "treasury_id": "string",
        "treasury_search_string": "string",
        "treasury_title": "string",
        "map(keyType,valueType)": null,
        "color_triplet": "string",
        "color_wiggle": "number",
        "latitude": "number",
        "longitude": "number",
        "image": "string",
        "region": "string",
        "currency": "string",
        "language": "string",
        "category": "string",
        "taxonomy": "any",
        "listing_variation": "any",
        "featured_rank": "number",
        "cart_id": "string | number",
        "text": "string"
    };

    static get(key: string) {
        if (this.typesMap.hasOwnProperty(key)) {
            return this.typesMap[key];
        }
        else {
            let arrayType = this.convertArray(key);
            if (arrayType) {
                return arrayType;
            }

            let enumType = this.convertEnum(key);
            if (enumType) {
                return enumType;
            }

            let mapType = this.convertMap(key);
            if (mapType) {
                return mapType;
            }

            console.warn(`The etsy types map does not contain value for the etsy type: '${key}'`);
            return "any";
        }
    }

    static convertArray(etsyType: string) {
        if (etsyType.startsWith("array")) {
            let extracted = /\(([^\)]+)\)/.exec(etsyType)[1];

            if (extracted == null) {
                console.warn("The extracted type for array is null.");
            }

            let type = this.get(extracted);

            if (type.split("|").length > 1) {
                return `(${type})[]`;
            }

            return `${type}[]`;
        }
    }

    static convertEnum(etsyType: string) {
        if (etsyType.startsWith("enum")) {
            let extracted = /\(([^\)]+)\)/.exec(etsyType)[1];

            if (extracted == null) {
                console.warn("The extracted type for enum is null.");
            }

            let types = extracted
                .split(",")
                .map(type => type.trim());

            return types
                .map(type => `"${type}"`)
                .join("|");
        }
    }

    static convertMap(etsyType: string) {
        if (etsyType.startsWith("map")) {
            return "object";
        }
    }
}