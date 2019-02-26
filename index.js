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
	let { username, password } = req.body;

	if (username && password) {
		db('users')
			.where('username', username)
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

server.get('/api/users',restricted, async (req, res) => {
	try {
		const users = await db('users');
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'No credentials provided' });
	}
});

server.post('/api/register', async (req, res) => {
	let { username, password } = req.body;
	const hash = bcrypt.hashSync(password, 16);
	password = hash;
	if (username && password) {
		try {
			const user = await db('users').insert({ username, password });
			res.status(201).json({ message: 'successfully registered', user });
		} catch (error) {
			res.status(500).json({ message: 'No credentials provided' });
		}
	} else {
	}
});

server.post('/api/login', async (req, res) => {
	let { username, password } = req.body;

	if (username && password) {
		try {
			const user = await db('users')
				.where('username', username)
				.first();
			if (user && bcrypt.compareSync(password, user.password)) {
				res.status(200).json({ message: `Welcome ${username}!` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		} catch (error) {
			res.status(500).json({ message: 'Server error' });
		}
	} else {
		res.status(500).json({ message: 'No credentials provided' });
	}
});

server.get('/api/brewery', async (req, res) => {
	try {
		const brew = await db('brewery');
		res.status(200).json(brew);
	} catch {
		res.status(500).json({ message: 'Unable to get breweries' });
	}
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
