const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// Get all tasks
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
  GROUP BY task.id, c.id, c.name ORDER BY task.id;`;

  pool.query(sqlText)
    .then((result) => {
      console.log('Result', result.rows);
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
*/


/*

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
*/




//Get all categories
router.get('/category', (req, res) => {
  const sqlText = 'SELECT * FROM category ORDER BY name;'
  pool.query(sqlText)
  .then((result) => {
    res.send(result.rows);
  })
  .catch( (err) => {
    console.log('Error getting all tasks: ', err);
    res.sendStatus(500);
  })
})

// Add a category
router.post('/category', (req, res) => {
  const newCategory = req.body.category;
  const sqlText = 'INSERT INTO category (name) VALUES ($1);'
  pool.query(sqlText, [newCategory.name])
  .then((result) => {
    res.sendStatus(201);
  })
  .catch( (err) => {
    console.log(`Error adding task`, err);
    res.sendStatus(500);
  })
});

// Delete a category
router.delete('/category/:id', (req, res) => {
  const categoryId = req.params.id;
  const sqlText = 'DELETE FROM category WHERE id=$1;'
  pool.query(sqlText, [categoryId])
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log(`Error removing category with id=${categoryId}`, err);
    res.sendStatus(500);
  })
});

// Update a category
router.put('/category/:id', (req, res) => {
  const newCategory = req.body.category;
  const categoryId = req.params.id;
  const sqlText = 'UPDATE category SET name=$1 WHERE id=$2;'
  pool.query(sqlText, [newCategory.name, categoryId])
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log('Error updating category: ', err);
    res.sendStatus(500);
  })
});

//Get all subtasks for a specific task
router.get(`/:id/subtask`, (req, res) => {
  const taskId = req.params.id;
  const sqlText = 'SELECT * FROM subtask WHERE task_id=$1 ORDER BY subtask.id;'
  pool.query(sqlText, [taskId])
    .then((result) => {
      res.send( result.rows );
    })
    .catch( (err) => {
      console.log('Error getting all tasks: ', err);
      res.sendStatus(500);
    })
});

// Get a specific subtask
router.get(`/subtask/:id`, (req, res) => {
  const subtaskId = req.params.id;
  const sqlText = 'SELECT * FROM subtask WHERE id=$1;'
  pool.query(sqlText, [subtaskId])
    .then((result) => {
      let subtask = null;
      if (result.rows.length > 0) {
        subtask = result.rows[0];
      }
      res.send( { subtask: subtask } );
    })
    .catch( (err) => {
      console.log('Error getting all tasks: ', err);
      res.sendStatus(500);
    })
});

// Add subtasks
router.post('/:id/subtask', (req, res) => {
  const taskId = req.params.id;
  const subtasks = req.body.subtasks;

  (async () => {
    try {
      await pool.query('BEGIN')
      for (newSubtask of subtasks) {
        const queryStuff = buildInsertSqlForSubtask(newSubtask, taskId)
        const { rows } = await pool.query(queryStuff.sqlText, queryStuff.values);
      }
      await pool.query('COMMIT')
      res.sendStatus(201);
    } catch (err) {
      await pool.query('ROLLBACK')
      console.log(`Error adding subtasks`, err);
      res.sendStatus(500);
    } 
  })().catch(e => console.error(e.stack))
});

function buildInsertSqlForSubtask(newSubtask, taskId) {
  let fieldsSql = '(task_id,';
  let valuesSql = '($1,'
  const values = [taskId];
  let counter = 2;
  if (newSubtask.description) {
    fieldsSql += ` description,`;
    valuesSql += ` $${counter++},`;
    values.push(newSubtask.description);
  } 
  if (newSubtask.complete) {
    fieldsSql += ` complete,`;
    valuesSql += ` $${counter++},`;
    values.push(newSubtask.complete);
  }
  //Remove trailing , at end of fields
  fieldsSql = fieldsSql.substring(0, fieldsSql.length - 1);
  valuesSql = valuesSql.substring(0, valuesSql.length - 1);
  //Add trailing ) at end of fields
  fieldsSql = fieldsSql + ')';
  valuesSql = valuesSql + ')';

  const sqlText = `INSERT INTO subtask ${fieldsSql} VALUES ${valuesSql};`;
  return {
    sqlText: sqlText,
    values: values
  }
}

// Delete a subtask
router.delete('/subtask/:id', (req, res) => {
  const subtaskId = req.params.id;
  const sqlText = 'DELETE FROM subtask WHERE id=$1;'
  pool.query(sqlText, [subtaskId])
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log(`Error removing category with id=${categoryId}`, err);
    res.sendStatus(500);
  })
});

// Update a subtask
router.put('/subtask/:id', (req, res) => {
  const newSubtask = req.body.subtask;
  const subtaskId = req.params.id;
  let setSql = '';
  const values = [subtaskId];
  let counter = 2;
  if (newSubtask.description) {
    setSql += ` description=$${counter},`;
    counter++;
    values.push(newSubtask.description);
  } 
  if (newSubtask.complete) {
    setSql += ` complete=$${counter},`;
    counter++;
    values.push(newSubtask.complete);
  }
  //Remove trailing , at end of update fields
  setSql = setSql.substring(0, setSql.length - 1);

  const sqlText = `UPDATE subtask SET ${setSql} WHERE id=$1;`
  pool.query(sqlText, values)
  .then((result) => {
    res.sendStatus(200);
  })
  .catch( (err) => {
    console.log('Error updating subtask: ', err);
    res.sendStatus(500);
  })
});

module.exports = router;