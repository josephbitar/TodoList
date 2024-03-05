import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const userId = event["queryStringParameters"]['userId'];;
  const command = new QueryCommand({
    TableName: "todo-list",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    ConsistentRead: true,
  });
  const response = await docClient.send(command);
  return response?.Items[0]?.todos;
};