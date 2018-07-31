const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

//Static files
//app.use( express.static( 'server/public' ) );

//Setup router
const taskRouter = require('./modules/task.router');
app.use('/task', taskRouter);

const PORT = process.env.PORT || 5000;
app.listen( PORT, function() {
  console.log('Server is listening on ', PORT);
})