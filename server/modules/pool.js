const pg = require('pg');
const url = require('url');

let config = {};
let DEFAULT_DB_NAME = 'tasks-with-subs-cats';

if (process.env.DATABASE_URL) {
  // Turns a URL into config object
  // Sample URL: postgres://xxxxxbbbbb:d897689769876896787dsaf876asdf897as6df876@ec2-12-12-123-123.compute-1.amazonaws.com:5432/d747826239
  let params = url.parse(process.env.DATABASE_URL);
  let auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true, // heroku requires ssl to be true
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };

} else {

  config = {
    user: process.env.PG_USER || null, 
    password: process.env.DATABASE_SECRET || null, 
    host: process.env.DATABASE_SERVER || 'localhost', 
    port: process.env.DATABASE_PORT || 5432, 
    database: process.env.DATABASE_NAME || DEFAULT_DB_NAME, 
    max: 10, 
    idleTimeoutMillis: 30000, 
  };
}

module.exports = new pg.Pool(config);