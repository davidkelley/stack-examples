const REGION = process.env.REGION;

exports.handler = (event, context, cb) => {
  const { name } = event.queryStringParameters;
  cb(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=500'
    },
    body: JSON.stringify({
      hello: name,
    }),
  });
};
