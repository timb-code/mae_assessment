# devops-sample repository


### Summary:
This is a realistic sample of what you'll regularly deal with in the Marketing Web Automation role.  We need several containers created in order to enable this repository to run in a local environment.


### Rules:
- Get as far as you can in 30 minutes.
- Your solution must run on a local machine.
- Please use any and all resources available to you (AI, Google, Stack Overflow, phone a friend, etc.)
- Use Dockerfiles and/or docker-compose.yml files - as many as you require.
- Arrange the solution in any way you see fit.  You may create any files or folders you need, but the only existing file you can modify is `.env`
- You are not expected to complete all of this in 30 minutes.  We're more interested in seeing your approach and how far you get in that time.


### Goals:
- When the application container(s) are running, we are able to visit localhost:3000 and see a simple web page with the following messages:
```
Service Status
MySQL Connection: MySQL Status: Connected
Database Schema: Schema Status: Present (Schema: testdb)
Has the first cli command been run on loading: Yes
Has the second command been run: Yes
EXTRA CREDIT: Redis Connection: Redis Status: Connected
```

### Details:
We have a repository (this one), with a simple Node.js application that we need to serve up to the browser.  The CLI command to run the application is: `'npm run dev'` OR `command: ["npm", "run", "dev"]`
For the Node.js image, you may use a custom Dockerfile or an existing image.  The version of Node.js required is 18.
The Node.js container will need to run `npm install` during the build process or when it is first stood up.

The node application requires a database. The docker image should be: `mariadb:10.5.8`
We want to map a docker volume for the database: `./data/mysql:/var/lib/mysql` (bind `/data/mysql` in this repo to `/var/lib/mysql` in the database container)
The `.env` file has the database credentials the app uses, so the database image should also have those same credentials configured.
When the database container is first stood up, we want to import the included `init.sql` file into the database.  This will create the database and the table that the Node.js application requires.

There are two bash files that need to be run as commands:
`commandOne.sh` - should be run when the container is first stood up.  It will create an empty file in the root of the app container named `first_command_complete`.  
`commandTwo.sh` - should be run at the user's descretion either via passing a variable or flag to docker compose, or via a new variable in the .env file.  It will create an empty file in the root of the app container named `second_command_complete`.


### EXTRA CREDIT:
Add a redis container.  The redis docker image should be: `redis:6.0.9`

---

**When completed, please create a pull request with your changes to the https://github.com/jack-warford/marketing_automation repository**


If you have any questions or require any clarification, you may reach out to me by responding to the email that linked you here.
