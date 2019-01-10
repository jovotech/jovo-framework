# Database Integrations

Learn how to store user specific data to databases with the Jovo Persistence Layer.

* [Introduction](#introduction)
* [Available Integrations](#available-integrations)


## Introduction

The Jovo Database Interface is an abstraction layer for persisting data across sessions. By default, the file-based system [File DB](./file-db.md './file-db') will be used so you can start right away when prototyping locally.


## Available Integrations

Here is a list of all available database integrations for Jovo:

Name | Description
------------ | -------------
[File DB](./file-db.md './databases/file-db') | File-based system for local prototyping. Default.
[DynamoDB](./dynamodb.md './databases/dynamodb') | NoSQL database by AWS
[Google Cloud Datastore](./google-datastore.md './databases/google-datastore') | NoSQL database by Google Cloud
[MySQL](./mysql.md './databases/mysql') | The open source relational database
[MongoDB](./mongodb.md './databases/mongodb') | widely supported documented-oriented NoSQL-database
[Cosmos DB](./cosmosdb.md './databases/cosmosdb') | Database service by Azure


<!--[metadata]: {"description": "Learn how to store user specific data to different types of databases with the Jovo Framework",
"route": "databases" }-->
