CREATE KEYSPACE sdc_andrew WITH REPLICATION = { 'class': 'NetworkTopologyStrategy', 'datacenter1': 1 };

USE sdc_andrew;

CREATE TABLE IF NOT EXISTS movieInfo (
    id int,
    name varchar,
    genre varchar,
    score smallint,
    runtime smallint,
    rating varchar,
    releaseDay smallint,
    releaseMonth varchar,
    releaseYear smallint,
    image varchar,
    PRIMARY KEY ((releaseYear), id)
  );

COPY movieinfo(id, name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image) FROM '~/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdc-cassandra-data.csv' WITH HEADER = TRUE AND NUMPROCESSES = 20 AND CHUNKSIZE = 1000 AND MAXBATCHSIZE = 15;
