import dotenv from 'dotenv';

import server from './src/app/index.js';

dotenv.config();


const app = server();

const start = async () => {
  try {
    await app.listen(process.env.PORT, process.env.HOST);
  } catch (err) {
    console.error(err);
    app.log.error(err);
    process.exit(1);
  }
};
start();