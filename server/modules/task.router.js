const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.get('/', (req, res) => {

  // More infor on this query: 
  // https://foxypanda.me/returning-an-array-of-json-objects-in-postgresql/
  const sqlText = 
  `SELECT 
    task.*, 
	  CASE WHEN count(st) = 0 THEN ARRAY[]::json[] ELSE array_agg(st.subtask) END AS subtasks,
	  json_build_object('id', c.id, 'name', c.name) as category
  FROM task 
  JOIN category c ON task.category_id = c.id 
  LEFT OUTER JOIN (
      SELECT task_id, json_build_object('id', subtask.id, 'task_id', subtask.task_id, 'description', 	subtask.description, 'complete', subtask.complete) as subtask
      FROM subtask ORDER BY subtask.id
    ) st on st.task_id=task.id 
  GROUP BY task.id, c.id, c.name;`;

  pool.query(sqlText)
    .then((result) => {
      console.log('Result', result.rows);
      let tasks = [];
      res.send(result.rows);
    })
    .catch( (err) => {
      console.log('Error getting all tasks: ', err);
      res.sendStatus(500);
    })
});



/*
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
*/

module.exports = router;