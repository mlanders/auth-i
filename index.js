const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');

const server = express();
const db = knex(knexConfig.development);

server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(express.json());

function restricted(req, res, next) {
	let { username, password } = req.headers;

	if (username && password) {
		Users.findBy({ username })
			.first()
			.then(user => {
				// check that passwords match
				if (user && bcrypt.compareSync(password, user.password)) {
					next();
				} else {
					res.status(401).json({ message: 'Invalid Credentials' });
				}
			})
			.catch(error => {
				res.status(500).json({ message: 'Unexpected error' });
			});
	} else {
		res.status(400).json({ message: 'No credentials provided' });
	}
}

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

server.get('/api/users', async (req, res) => {
	try {
	} catch {}
});

server.post('/api/register', async (req, res) => {
	try {
	} catch {}
});

server.post('/api/login', async (req, res) => {
	try {
	} catch {}
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
