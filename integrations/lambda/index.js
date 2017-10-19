const REGION = process.env.REGION;

exports.handler = (event, context, cb) => {
  const { name } = event.queryStringParameters;
  cb(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hello: name,
    }),
  });
};
