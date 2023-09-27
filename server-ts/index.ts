import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 1234;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server from TS');
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});