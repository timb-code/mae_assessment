const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const redis = require('redis');
const dotenv = require("dotenv")
dotenv.config()

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const db = process.env.DB_NAME;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

// Create a Redis client
const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort
});

// Create a MySQL connection pool (it is a good practice to use a pool of connections).
const pool = mysql.createPool({
    host     : dbHost, // This is typical in Docker-compose setups.
    user     : dbUser,
    password : dbPass,
    database : db
});

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/mysql-status') {
        // Check MySQL connection status
        pool.getConnection((err, connection) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Error', message: err.message }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'Connected' }));
            connection.release(); // Always release connection back to the pool
        });
    }  else if (req.method === 'GET' && req.url === '/check-schema') {
        // Replace 'your_schema_name' with the name of the schema you want to check
        const checkSchemaQuery = 'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?';

        pool.query(checkSchemaQuery, ['testdb'], (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Error', message: err.message }));
            } else if (results.length > 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Present', schema: results[0].SCHEMA_NAME }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Not Present' }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/first-run-status') {
        const FIRST_RUN_FLAG = path.join(__dirname, '/first_command_complete');
        fs.access(FIRST_RUN_FLAG, fs.constants.F_OK, (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ firstRun: !!err }));
        });
    } else if (req.method === 'GET' && req.url === '/extra-command-status') {
        const SECOND_RUN_FLAG = path.join(__dirname, '/second_command_complete');
        fs.access(SECOND_RUN_FLAG, fs.constants.F_OK, (err) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ firstRun: !!err }));
        });
    } else if (req.method === 'GET' && req.url === '/redis-status') {
        // Check Redis connection status
        redisClient.ping((err, reply) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Error', message: err.message }));
                return;
            }
            if(reply === 'PONG') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Connected' }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Disconnected' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
