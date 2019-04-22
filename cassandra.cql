USE sdcandrew;

COPY movieinfo(id, name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image) FROM '~/code/my_own/Capston_Projects/sdc/andrew-sdc-data-generation/sdc-cassandra-data.csv' WITH HEADER = TRUE AND NUMPROCESSES = 8 AND CHUNKSIZE = 1500 AND MAXBATCHSIZE = 100;
