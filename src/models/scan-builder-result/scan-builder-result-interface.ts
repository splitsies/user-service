import { AttributeValue } from "@aws-sdk/client-dynamodb/dist-types/models/models_0";

export interface IScanBuilderResult {
    readonly attributeValues: Record<string, AttributeValue>;
    readonly attributeNames: Record<string, string>;
    readonly filterExpression: string;
}
