const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION;
const TABLE = process.env.TABLE;

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const cities = ['london', 'liverpool', 'manchester', 'birmingham'];

const documentClient = () => {
  const params = { TableName: TABLE };
  return new AWS.DynamoDB.DocumentClient({ region: REGION, params });
}

exports.schedule = (event, context, cb) => {
  const city = cities[rand(0, cities.length - 1)];
  const time = new Date().getTime();
  const temp = rand(1, 10);
  const Item = { city, time, temp };
  documentClient().put({ TableName: TABLE, Item }, (err) => {
    if (err) {
      cb(err);
    } else {
      cb(null, Item);
    }
  });
}
