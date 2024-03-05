# TodoListApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0. This simple web application allows users to create, view, mark as done, and delete todo list items. The app is built using Angular and leverages AWS services such as Cognito, S3, API Gateway, Lambda, and DynamoDB for authentication, storage, and backend functionality.

<img width="1034" alt="Screenshot 2024-02-17 at 11 28 20 PM" src="https://github.com/josephbitar/TodoList/assets/69281752/2c9cea91-83c5-47cc-8898-ed53148140c8">
New Todo Item:
<img width="1278" alt="Screenshot 2024-03-04 at 9 09 34 PM" src="https://github.com/josephbitar/TodoList/assets/69281752/48116e30-4ee8-469e-b026-df329596d041">
List Todo Items:
<img width="1228" alt="Screenshot 2024-03-04 at 9 09 19 PM" src="https://github.com/josephbitar/TodoList/assets/69281752/131ba4c7-f6ef-4ff8-b488-e55e3e6e28fb">

## AWS Services Integration

1. Cognito:
- Handles user authentication and provides secure access to the app.
2. S3 Bucket:
- Stores attachments (images/documents) uploaded by users.
3. API Gateway:
- Manages API endpoints for creating, reading, and deleting todo items.
4. Lambda Functions:
- Create Todo Lambda: Receives the payload from the frontend, stores the todo item in DynamoDB, and uploads the attachment to S3.
- Get Todos Lambda: Retrieves the list of todo items from DynamoDB.
- Delete Todo Lambda: Deletes a todo item from DynamoDB.
5. DynamoDB:
- Stores the todo items and their associated information.

### Note: 
Please change all the AWS configs in the environments.props.ts accordingly based on your AWS resources.

## Authentication
- The app is secured using AWS Cognito, providing a secure and scalable user authentication solution.
- Users need to sign in with their credentials to access the features of the app.

# Prerequisites
- Node.js and npm installed locally.
- AWS account that has all the services created above.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
