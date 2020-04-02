# training-4
This is a clone of CodePen using Node.js + Express + PostGres


## Project Requirements:
* PostGres (recommended: v12+)
* Node.js (recommended: v12.14.+)

## Run Development environment

1. Create a PostGres db (default is 'postgres').
2. Update your `config.json` with the correct DB name, port, username and password.
3. Run install commands:  

```
npm install

```
4. Run migration commands:  

```
npm run migrate

```
5. Run start commands:  

```
npm start

```

## Run Test environment

#### Create PostGres db:  
1. Create a PostGres db (default is 'codepen-test').
2. Update your `config.json` with the correct DB name, port, username and password.
3. Run install commands:  

```
npm install

```
4. Run migration commands for test database:  

```
npm run test-migrate

```
5. Run backend test commands:  

```
npm run test

```