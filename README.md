# andrew-sdc-data-generation
Repo to generate 10M data points for SDC.
Used faker for random string's and numbers.
Pull image data from s3 bucket. Random image chosen from 800 different images.

## Usage
 - `npm run write:data` to write sdcData.csv with 10M data points to root folder.
 - `npm run seed:postgres` to create table "movie info" and seed postgreSQL database "mydb".
 
## Installation
 - `npm install`
