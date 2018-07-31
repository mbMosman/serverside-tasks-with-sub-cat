# Tasks: Server-side

Server side code for a tasks database. This is intended as practice for working with SQL transactions using PG & Postgres.

## Setup
To run this application, you must have node.js and postgres installed.

### Database
To run this code you must have a database setup.  The database name is assumed to be `tasks-with-subs-cats`. It can be changed in the `server/modules/pool.js` file.

The table setup is documented in the `database.sql` file & test data may be added using the `testdata.sql` file.

### Node server
To get this application running locally, download the code, setup the database (above) and then run the following commands to install dependencies and start the node server.

```
npm install
npm start
```

## Testing 
This code does not have a front-end or client-side user interface. However you can use a tool such as [Postman]() to send requests to the server to select, add, remove and update data through the server-side REST API.

## API

### Get All Tasks
Request Type: GET
Url: `/task`

This will get all tasks from the database and return them as an array of task objects.

Response Format:
```
{ taskList: [
    {
      id: integer,
      description: string,
      created: date,
      due: date,
      complete: boolean,
      category: {
        id: integer,
        name: string 
      },
      subtasks: [
        {
          description: string,
          complete: boolean
        }
      ]
    }
  ]
}
```

### Add New Task
Request Type: POST
Url: `/task`
Body: 
```
{ task: {
    description: string,
    created: date (optional, defaults to now)
    due: date (optional),
    complete: boolean (optional, defaults to false)
    category_id: integer (optional)
    category: {
      name: string (optional, creates new category)
    },
    subtasks: [
    {
      description: string,
      complete: boolean (optional, defaults to false)
    }
  ]
  }
}
```

This will add a new task to the database. 

### Delete a Task
Request Type: DELETE
Url: `/task/:id`

This will remove a task from the database.

### Update a Task
Request Type: PUT
Url: `/task/:id`
Body: 
```
{ task: {
    description: string (optional),
    due: date (optional),
    complete: boolean (optional)
    category_id: integer (optional) 
  }
}
```

This will update any included task properties in the database. If a property is not included it's value will not be modified.

### Get All Categories
Request Type: GET
Url: `/task/category`

This will get all task categories from the database and return them as an array of category objects.

### Add Task Category
Request Type: POST
Url: `/task/category`
Body: 
```
{ category: {
    name: string
  }
}
```

This will add a new task category to the database. 

### Delete a Task Category
Request Type: DELETE
Url: `/task/category/:id`

This will remove a task category from the database.

### Update a Task Category
Request Type: PUT
Url: `/task/category/:id`
Body: 
```
{ category: {
    name: string
  }
}
```

This will update a task category name. 

### Get A Subtask
Request Type: GET
Url: `/task/subtask/:id`

This will get a subtask from the database.

### Add Subtasks
Request Type: POST
Url: `/task/:id/subtasks`
Body: 
```
{ subtasks: [
    {
      description: string,
      complete: boolean (optional, defaults to false)
    }
  ]
}
```

This will add new subtasks to an existing task in the database. 

### Delete a Subtask
Request Type: DELETE
Url: `/task/subtask/:id`

This will remove a subtask from the database.

### Update a subtask
Request Type: PUT
Url: `/task/subtask/:id`
Body: 
```
{ subtask: {
    description: string (optional),
    complete: boolean (optional) 
  }
}
```

This will update any included subtask properties in the database. If a property is not included it's value will not be modified.
