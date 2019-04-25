/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './amazon.env' });
}
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const params = {
  Bucket: process.env.BUCKET || 'sdc-andrew-movie-posters',
  MaxKeys: 800,
};

const listAllObjects = async () => {
  let imgUrlArray = [];
  try {
    const data = await s3.listObjectsV2(params).promise();
    imgUrlArray = data.Contents.map((elem) => {
      let key = elem.Key;
      for (let i = 0; i < key.length; i += 1) {
        if (key[i] === ' ') {
          key = `${key.slice(0, i)}+${key.slice(i + 1)}`;
        }
      }

      const url = `${process.env.IMG_HOST}${key}`;
      return url;
    });
  } catch (e) {
    console.log(e);
    return e;
  }
  return imgUrlArray;
};

module.exports = listAllObjects;
