import * as dotenv from 'dotenv';
dotenv.config(); // MUST be before any other imports that use process.env

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://0.0.0.0:${PORT}`);
});
