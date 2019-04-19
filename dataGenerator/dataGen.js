const fs = require('fs');
const csvWriter = require('csv-write-stream');
const faker = require('faker');
const generateImgList = require('./s3Images.js');

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


const writer = csvWriter();

const writeCsv = async () => {
  try {
    const imgUrlList = await generateImgList();

    writer.pipe(fs.createWriteStream('sdcData.csv'));
    for (let i = 1; i <= 10000000; i += 1) {
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
      // console.log(name, genre, score, runtime, rating, releaseDay, releaseMonth, releaseYear, image);
      writer.write({
        name,
        genre,
        score,
        runtime,
        rating,
        releaseDay,
        releaseMonth,
        releaseYear,
        image,
      });
    }
    writer.end();
    return console.log('done writing!');
  } catch (e) {
    console.log(e);
    return e;
  }
};

writeCsv();
