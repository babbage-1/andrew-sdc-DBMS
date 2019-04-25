const fs = require('fs');
const csvWriter = require('csv-write-stream');
const faker = require('faker');
const generateSampleImgList = require('./s3SampleImages');

const genreGen = () => {
  const genreObj = {
    0: 'Horror',
    1: 'Romance',
    2: 'Comedy',
    3: 'Action',
    4: 'Drama',
    5: 'Fantasy',
    6: 'Adventure',
    7: 'Animation',
  };

  const genreSet = new Set();
  const randInt = faker.random.number({
    min: 0,
    max: 4,
  });

  for (let i = 0; i <= randInt; i += 1) {
    const randIndex = faker.random.number({
      min: 0,
      max: 6,
    });
    genreSet.add(genreObj[randIndex]);
  }
  const genreArray = Array.from(genreSet);
  return genreArray.join('|');
};

const ratingGen = () => {
  const ratingObj = {
    0: 'PG-13',
    1: 'PG',
    2: 'R',
    3: 'G',
  };

  const ratingIndex = faker.random.number({
    min: 0,
    max: 3,
  });

  return ratingObj[ratingIndex];
};

const writeSampleCsv = async (dbString) => {
  const writer = csvWriter();
  try {
    console.time(`write ${dbString} sample 1,000,000 data`);
    const imgUrlList = await generateSampleImgList();

    writer.pipe(fs.createWriteStream(`sdc-sample-${dbString}-data.csv`));
    for (let i = 1; i <= 1000000; i += 1) {
      const name = faker.lorem.words();
      const genre = genreGen();
      const score = faker.random.number({
        min: 1,
        max: 5,
      });
      const runtime = faker.random.number({
        min: 70,
        max: 200,
      });
      const rating = ratingGen();
      const releaseMonth = faker.date.month({
        type: 'wide',
      });
      const releaseDay = faker.random.number({
        min: 1,
        max: 28,
      });
      const releaseYear = faker.random.number({
        min: 1960,
        max: 2020,
      });
      const randImgIndex = faker.random.number({
        min: 0,
        max: 2,
      });
      const image = imgUrlList[randImgIndex];
      let dataObj;

      if (dbString === 'postgresql') {
        dataObj = {
          name,
          genre,
          score,
          runtime,
          rating,
          releaseDay,
          releaseMonth,
          releaseYear,
          image,
        };
      }
      if (dbString === 'cassandra') {
        dataObj = {
          id: i,
          name,
          genre,
          score,
          runtime,
          rating,
          releaseDay,
          releaseMonth,
          releaseYear,
          image,
        };
      }
      // console.log(name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image);
      writer.write(dataObj);
    }
    await writer.end();
    return console.log('done writing!');
  } catch (e) {
    console.log(e);
    return e;
  } finally {
    console.timeEnd(`write ${dbString} sample 1,000,000 data`);
  }
};

module.exports = {
  writeSampleCsv,
};
