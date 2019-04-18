const faker = require('faker');

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
  for (let i = 0; i <= 4; i += 1) {
    const randInt = faker.random.number({
      min: 0,
      max: 6,
    });
    genreSet.add(genreObj[randInt]);
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
