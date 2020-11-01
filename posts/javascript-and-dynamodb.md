+++
title=Local development with DynamoDB and JavaScript
date=1604214136359
tags=["DynamoDB", "javascript", "docker", "tech"]
+++
# Local development with DynamoDB and JavaScript

I was interested in learning how use DynamoDB, but didn't want to set
it up on AWS personally because I'm lazy, and scared of accidentally getting
billed for 10,000 euros.

Instead I decided to run it locally in a docker-container.

This article is going to walk through the process that I followed, in case you
want to do something similar.

## Creating the DynamoDB container
The first step is to create a `docker-compose.yaml`.
Docker Compose let's us define containers that we want to run to support our
project. It's a pretty neat way to set up a development environment.

Here's the file I created

```yaml
version: '3' # The version of docker-compose syntax we're using. Just pick 3 I guess

services: # We define the containers we want to create under this header
  dynamodb:
    image: amazon/dynamodb-local # The image we're using. Thanks Amazon.
    container_name: dynamodb-local
    ports:
      - "8042:8000" # binds the localhost port on the left, to the container port on the right
```

### Running the container
You'll need docker installed for this step.

Run this command
`docker-compose -f docker-compose.yaml up -d`

`-f` allows us specify the file to use, in our case this is the
docker-compose.yaml we just created

`up` tells docker-compose to “build, (re)create, start, and attache to containers for a service.”
`-d` specifies that we want to run the container in 'detached' mode.

Now our container should be running. Running `docker ps` in the command line
should show that the container is alive and kicking.

## The JavaScript stuff
### Making our first table

To use DynamoDB in JavaScript, we're going to rely on the aws-sdk. So let's
install it!

`yarn add aws-sdk`

And then let's use it to make a table!
```javascript
const AWS = require('aws-sdk');

async function main() {
  // Even though we're using the SDK locally the SDK will throw an error 
  // if these items are missing. We don't need to use real keys for local
  // development however.
  AWS.config.update({
    region: 'local',
    accessKeyId: 'random-not-real-id',
    secretAccessKey: 'random-not-real-key',
  })

  // Now we create our Client!
  const dynamoClient = new AWS.DynamoDB({ endpoint: 'http://localhost:8042' })

  // And we can start making tables

  try {
    await dynamoClient.createTable({
      // The name  of our table
      TableName: 'user-info',

      // The attributes that our needed to create our primary key.
      // We can still store other data as part of each item, but we don't need
      // to define it as part of the table
      AttributeDefinitions: [
        {
          AttributeName: 'name',
          AttributeType: 'S',
        }
      ],

      // How the primary keys for our table are generated.
      // In our case we are simply going to hash the attribute 'name'
      KeySchema: [
        {
          AttributeName: 'name',
          KeyType: 'HASH',
        },
      ],

      // Some Config stuff. Ask your ops team about this I guess.
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    }).promise()

    console.log('create table user-info')

  } catch (e) {
    console.error(error)
    process.exit(1)
  }
}
```

Although we only specified the attributes that are required to make each items
primary key, we can store other data in each item.

### Data in the base

A thing that puzzled me when looking at the DynamoDB sdk was the difference between a  `DynamoClient` and a `DocumentClient`. We used the `DynamoClient` to create our table above, but using that to add data actually becomes quite tricky. We have to painstakingly describe the different keys we'll be adding.

The document client seems to have been added to the SDK to make life easier for JavasScript developers. It gives us some methods that let us interact with our DB using normal JavaScript objects that match the shape of the data we want to store. More details can be seen in [this announcement post](https://aws.amazon.com/blogs/developer/announcing-the-amazon-dynamodb-document-client-in-the-aws-sdk-for-javascript/).

Long story short, we're going to use the `DocumentClient` to store data in our
table.

```
const docClient = new AWS.DynamoDB.DocumentClient({ endpoint: 'http://localhost:8042' })
```

Now to make our lives easier let's define a function that adds users to our
table.

```javascript
const addUser = async (name, email) => {
  return docClient.put({
    Item: {
      name,
      email
    },
    TableName: 'user-info'
  }).promise()
}
```

and one to list all of our users
```javascript
const listUsers = async () => {
  return docClient.scan({
    TableName: 'user-info'
  }).promise()
}
```

We can then use these functions to add some users to our table, and then print
them out again.

```javascript
const addUsers = async () => {
  await addUser('bobby', 'bobby@bob.com')
  await addUser('tomboy', 'tom@boy.com')
  await addUser('blobby', 'mr@blobby.com')
  console.log(await listUsers())
}

addUsers()
```

If we run this code we'll see the following output in our terminal
```
{
  Items: [
    { name: 'bobby', email: 'bobby@bob.com' },
    { name: 'blobby', email: 'mr@blobby.com' },
    { name: 'tomboy', email: 'tom@boy.com' }
  ],
  Count: 3,
  ScannedCount: 3
}
```

## Conclusion
You'se now seen how to set up a local DynamoDB - and how to do some basic
interaction with it in JavaScript. A runnable version of the code in this
article can be [found here](https://github.com/Jwhiles/dynamo-something).

