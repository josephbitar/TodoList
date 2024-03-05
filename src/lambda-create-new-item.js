import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, QueryCommand, UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createHash } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

function getPayload(event) {
    return JSON.parse(event.body);
}

function hashValue(value) {
    const hash = createHash('sha256');
    hash.update(value);
    const hashedValue = hash.digest('hex');
    return hashedValue;
}

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

async function createItem(userId, items) {
    const command = new PutCommand({
        TableName: 'todo-list',
        Item: {userId: userId, "todos": items}
    })
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
    console.log(JSON.stringify(event))

    // Get the payload
    let todoItem = getPayload(event);
    let userId = todoItem.userId;
    todoItem.id = hashValue(new Date().toISOString())
    todoItem.done = false;

    // Query the userId to get the existing items
    let queryResponse = await getTodoItemsByUserId(todoItem.userId);

    let items = [];
    let response;
    if (queryResponse && queryResponse.Items && queryResponse.Items.length > 0 && queryResponse.Items[0].todos) { // update..
        items = queryResponse.Items[0].todos;
        items.push(todoItem);
        response = await updateItem(userId, items);
    } else { // create
        items.push(todoItem);
        response = await createItem(userId, items);
    }
    console.log(response);
    return items;
};
