const fs = require('fs');
const Velocity = require('velocityjs');
const escapeJavaScript = require('js-string-escape');
const jsonpath = require('jsonpath');
const Compile = Velocity.Compile;

const template = fs.readFileSync(`${__dirname}/temp.vm`, { encoding: 'utf8' });

var asts = Velocity.parse(template);

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

const stageVariables = {
  temp: 'stage temp var'
};

const context = {};

const body = JSON.stringify({
  hello: {
    my: 'world',
    counts: [1,2,3,4,5]
  },
  cities: [
    { name: "London", "population": 8615246 },
    { name: "Berlin", "population": 3517424 },
    { name: "Madrid", "population": 3165235 },
    { name: "Rome",   "population": 2870528 }
  ]
});

const request = {
  body,
  parameters: {
    path: {
      // http path parameter
      a: 'b',
    },
    header: {
      // http header key:val
      'Content-Type': 'application/json',
    },
    querystring: {
      // querystring parameter
      foo: '"some \'funky injection"',
    }
  }
};

const input = {
  body: request.body,
  path: (path) => jsonpath.value(JSON.parse(input.body), path),
  json: (path) => JSON.stringify(input.path(path)),
  params: (val = null) => {
    if (!val) {
      return request.parameters;
    } else {
      const path = request.parameters.path[val];
      const header = request.parameters.header[val];
      const querystring = request.parameters.querystring[val];
      return path || header || querystring;
    }
  }
};

const util = {
  escapeJavaScript: (str) => escapeJavaScript(str),
  parseJson: (str) => JSON.parse(str),
  urlEncode: (str) => encodeURIComponent(str),
  urlDecode: (str) => decodeURIComponent(str),
  base64Encode: (str) => new Buffer(str).toString('base64'),
  base64Decode: (str) => new Buffer(str).toString('ascii'),
};

const local = {
  context,
  input,
  util,
  stageVariables,
};

const macros = {};

const txt = new Compile(asts).render(local, null);

console.log(JSON.stringify(JSON.parse(txt), null, '  '));
