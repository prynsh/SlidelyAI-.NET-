import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const dbFilePath = './src/db.json';

app.use(bodyParser.json());
app.get('/ping', (req: Request, res: Response) => {
  res.json(true);
});


app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).send('All fields are required.');
  }

  const newSubmission = { name, email, phone, github_link, stopwatch_time };
  
  const data = fs.readFileSync(dbFilePath, 'utf8');
  const db = JSON.parse(data);

  // Add new submission
  db.submissions.push(newSubmission);

  // Write updated submissions back to the file
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));

  res.status(201).send('Submission saved successfully.');
});

// Endpoint to read a specific submission
app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);

  if (isNaN(index)) {
    return res.status(400).send('Invalid index.');
  }

  // Read existing submissions
  const data = fs.readFileSync(dbFilePath, 'utf8');
  const db = JSON.parse(data);

  if (index < 0 || index >= db.submissions.length) {
    return res.status(404).send('Submission not found.');
  }

  res.json(db.submissions[index]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
