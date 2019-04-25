CREATE KEYSPACE testsdcandrew WITH REPLICATION = { 'class': 'NetworkTopologyStrategy', 'datacenter1': 1 };

USE testsdcandrew;

CREATE TABLE IF NOT EXISTS testmovieInfo (
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

COPY testmovieinfo(id, name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image) FROM '~/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdc-sample-cassandra-data.csv' WITH HEADER = TRUE AND NUMPROCESSES = 16 AND CHUNKSIZE = 1000 AND MAXBATCHSIZE = 15;
