import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommandOutput,
  DeleteCommandOutput,
  DynamoDBDocument,
  GetCommandOutput,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { injectable, inject } from "tsyringe";

const translateConfig = {
  marshallOptions: {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: true, // false, by default.
  },
  unmarshallOptions: {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  },
};

@injectable()
export class DynamoService {
  protected ddbDocClient: DynamoDBDocument;

  constructor(
    @inject("DYNAMO_TABLE") protected tableName: string,
    @inject(DynamoDBClient) client: DynamoDBClient
  ) {
    this.ddbDocClient = DynamoDBDocument.from(client, translateConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async putItem(item: Record<string, any>): Promise<PutCommandOutput> {
    return await this.ddbDocClient.put({
      Item: item,
      TableName: this.tableName,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async batchWrite(
    items: Record<string, any>[]
  ): Promise<BatchWriteCommandOutput> {
    const reqs = {
      [this.tableName]: items.map((item) => ({ PutRequest: { Item: item } })),
    };

    return await this.ddbDocClient.batchWrite({
      RequestItems: reqs,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getItem(key: Record<string, any>): Promise<GetCommandOutput> {
    return await this.ddbDocClient.get({
      Key: key,
      TableName: this.tableName,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async deleteItem(
    key: Record<string, any>
  ): Promise<DeleteCommandOutput> {
    return await this.ddbDocClient.delete({
      TableName: this.tableName,
      Key: key,
    });
  }

  /*
    TODO Implement Query:
    import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";

// Set the parameters.
export const params = {
  ExpressionAttributeNames: { "#r": "rank", "#y": "year" },
  ProjectionExpression: "#r, #y, title",
  TableName: "TABLE_NAME",
  ExpressionAttributeValues: {
    ":t": "MOVIE_NAME",
    ":y": "MOVIE_YEAR",
    ":r": "MOVIE_RANK",
  },
  KeyConditionExpression: "title = :t and #y = :y",
  FilterExpression: "info.#r = :r",
};

export const queryTable = async () => {
  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    for (let i = 0; i < data.Items.length; i++) {
      console.log(
        "Success. Items with rank of " +
          "MOVIE_RANK" +
          " include\n" +
          "Year = " +
          data.Items[i].year +
          " Title = " +
          data.Items[i].title
      );
    }
  } catch (err) {
    console.log("Error", err);
  }
};
queryTable();


*/
}
