import { IScanBuilderResult } from "./scan-builder-result-interface";
import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export class ScanBuilderResult implements IScanBuilderResult {
    constructor(
        readonly attributeValues: Record<string, AttributeValue>,
        readonly attributeNames: Record<string, string>,
        readonly filterExpression: string,
    ) {}
}
