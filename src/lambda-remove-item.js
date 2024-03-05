import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createHash } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

async function updateItem(userId, items) {
    const command = new UpdateCommand({
        TableName: "todo-list",
        Key: {
          userId: userId,
        },
        UpdateExpression: "set todos = :todos",
        ExpressionAttributeValues: {
          ":todos": items,
        },
        ReturnValues: "ALL_NEW",
      });
      const response = await docClient.send(command);
      return response;
}

async function getTodoItemsByUserId(userId) {
    const command = new QueryCommand({
      TableName: "todo-list",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
      ConsistentRead: true,
    });
    const response = await docClient.send(command);
    return response;
}

export const handler = async (event) => {
    const userId = event["queryStringParameters"]['userId'];
    const id = event['pathParameters']['id'];
    console.log(JSON.stringify(event))

    // Query the userId to get the existing items
    let queryResponse = await getTodoItemsByUserId(userId);

    let items = [];
    let response;
    if (queryResponse && queryResponse.Items && queryResponse.Items.length > 0 && queryResponse.Items[0].todos) { // update..
        items = queryResponse.Items[0].todos;
        items = items.filter(item => item.id != id)
        response = await updateItem(userId, items);
    } 
    console.log(response);
    return items;
};
