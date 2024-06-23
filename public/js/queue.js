import Queue  from 'bull';
const dbQueue = new Queue('db-access', {
    redis: { host: '127.0.0.1', port: 6379 }
});

export default dbQueue;