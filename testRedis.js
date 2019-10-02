const Redis = require('ioredis');
const redis = new Redis({
    port: 6379,
    host: '127.0.0.1'
});
redis.keys('*').then(keys => {
    console.log(keys);
});
redis.set('a', 53615);
redis.del('a');
redis.setex('c', 10, 123);
