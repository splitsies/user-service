import { IUserSearchCriteria } from "src/models/user-search-criteria/user-search-criteria-interface";
import { ScanBuilderResult } from "src/models/scan-builder-result/scan-builder-result";
import { IScanBuilderResult } from "src/models/scan-builder-result/scan-builder-result-interface";

export class SearchScanBuilder {
    private readonly _chunkSize = 100;
    private readonly _filterClauses: string[] = [];
    private _result: IScanBuilderResult;

    constructor() {
        this._result = new ScanBuilderResult({}, {}, "");
    }

    getResult(): ScanBuilderResult {
        return new ScanBuilderResult(
            this._result.attributeValues,
            this._result.attributeNames,
            this._filterClauses.join(" AND "),
        );
    }

    buildPhoneNumberFilter(criteria: IUserSearchCriteria): void {
        if (criteria.phoneNumbers === undefined) return;
        this.generateCollectionFilter(
            criteria.phoneNumbers.map((p) => p.slice(-10)),
            "phoneNumber",
        );
    }

    buildIdFilter(criteria: IUserSearchCriteria): void {
        if (criteria.ids === undefined) return;
        this.generateCollectionFilter(criteria.ids, "id");
    }

    buildUsernameFilter(criteria: IUserSearchCriteria): void {
        if (!criteria.usernameFilter) return;

        this._result = new ScanBuilderResult(
            {
                ...this._result.attributeValues,
                ":usernameFilter": { S: criteria.usernameFilter },
                ":guestPrefix": { S: "@splitsies-guest" },
            },
            {
                ...this._result.attributeNames,
                "#id": "id",
                "#username": "username",
            },
            this._result.filterExpression,
        );

        this._filterClauses.push(`(begins_with(#username, :usernameFilter) AND NOT begins_with(#id, :guestPrefix))`);
    }

    private generateCollectionFilter(collection: string[], propertyName: string): void {
        if (collection?.length === 0) return;

        const items = new Set<string>();
        collection.forEach((i) => {
            items.add(i);
        });

        const expressionAttributes = {};
        const filterExpressionParams = [];
        Array.from(items).forEach((item, index) => {
            const placeholder = `:${propertyName}${index}`;
            filterExpressionParams.push(placeholder);
            expressionAttributes[placeholder] = { S: item };
        });

        const expressionPieces = [];
        for (let i = 0; i < filterExpressionParams.length; i += this._chunkSize) {
            expressionPieces.push(
                `#${propertyName} in (${filterExpressionParams.slice(i, i + this._chunkSize).join(",")})`,
            );
        }

        this._result = new ScanBuilderResult(
            {
                ...this._result.attributeValues,
                ...expressionAttributes,
            },
            {
                ...this._result.attributeNames,
                [`#${propertyName}`]: propertyName,
            },
            this._result.filterExpression,
        );

        this._filterClauses.push(`(${expressionPieces.join(" OR ")})`);
    }
}
