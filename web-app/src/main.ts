import express from 'express';

const app = express();
const port = 3000;

app.get('/api', (_req, res) => {
	res.send('Hello World!');
});

app.get('/api/12', (_req, res) => {
	res.send('121');
});

app.use(express.static('dist'));

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
