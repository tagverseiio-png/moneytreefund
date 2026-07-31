import app from './app';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`[server]: Server is running at http://0.0.0.0:${PORT}`);
});
