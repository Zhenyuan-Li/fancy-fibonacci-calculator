const redis = require('redis');
const { redisHost, redisPort } = require('./keys');

const redisClient = redis.redisClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

const fib = (i) => {
  if (i < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
