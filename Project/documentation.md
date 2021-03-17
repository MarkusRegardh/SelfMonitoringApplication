<h1>Documentation:</h1>

<h2>CREATE TABLE:</h2>

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);
<br>
CREATE UNIQUE INDEX ON users((lower(email)));
<br>
CREATE TABLE morninglogs (
  id SERIAL PRIMARY KEY,
  date DATE,
  sleep_duration FLOAT NOT NULL,
  sleep_quality INTEGER NOT NULL,
  mood INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id)
);
<br>

CREATE TABLE eveninglogs(
  id SERIAL PRIMARY KEY,
  date DATE,
  exercise FLOAT NOT NULL,
  study FLOAT NOT NULL,
  eating INTEGER NOT NULL,
  mood INTEGER NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

<h2>URL:</h2>
https://wsdprojectmr.herokuapp.com/ (does not work anymore)

<h2>Guide to running:</h2>
$Env:PGHOST=""<br>
$Env:PGDATABASE=""<br>
$Env:PGUSER=""<br>
$Env:PGPASSWORD=""<br>
$Env:PGPORT=<br>

Insert variables from database credentials, and on VSCODE terminal add these one by one. for example:<br>
$Env:PGPORT=12345<br>

then run this on terminal while on the project directory:<br>
deno run --unstable --watch --allow-read --allow-write --allow-net --allow-env app.js<br>

<h2>Running tests on the same directory:</h2>
deno test --unstable --allow-all<br>
Note: Variables need to be set for this to work<br>
Note: One test has an input of todays date, change that to currentdate to make it work<br>


<h3>Notes:</h3>
/behavior/summary/ gives avarage stats of the last 7 days FOR EACH day. This was the original task on<br>
the checklist, but was changed later on. I assume my version is ok.<br>



