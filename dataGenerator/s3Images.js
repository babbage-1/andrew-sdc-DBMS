const AWS = require('aws-sdk');
AWS.config.loadFromPath('s3Config.json');
const s3 = new AWS.S3();

const params = {
  Bucket: 'sdc-andrew-movie-posters',
  MaxKeys: 800,
};

const listAllObjects = async () => {
  const imgUrlArray = [];
  try {
    const data = await s3.listObjectsV2(params).promise();
    data.Contents.forEach((elem) => {
      let key = elem.Key;
      for (let i = 0; i < key.length; i += 1) {
        if (key[i] === ' ') {
          key = `${key.slice(0, i)}+${key.slice(i + 1)}`;
        }
      }
      const url = `https://s3.us-east-2.amazonaws.com/sdc-andrew-movie-posters/${key}`;
      imgUrlArray.push(url);
    });
  } catch (e) {
    console.log(e);
    return e;
  }
  console.log(imgUrlArray);
  return imgUrlArray;
};

listAllObjects();
module.exports = listAllObjects;
