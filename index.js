const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const { restricted } = require('./middleware/restricted');

const server = express();
const db = knex(knexConfig.development);

const sessionConfig = {
	name: 'auth', // name of session cookie
	secret: process.env.SESSION_SECRET || 'this is a secret', // secret stored in .env file
	cookie: {
		maxAge: 1000 * 60 * 15, //in ms, seconds, min, hour, y
		secure: false, // used over https only
	},
	httpOnly: true, //cannot access the cookie from js using document.cookie
	resave: false, //
	saveUninitialized: false, // laws agains setting cookies automatically
	store: new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
		sidfieldname: 'sid', //session id field name
		createtable: true,
		clearInterval: 1000 * 60 * 60, // in ms
	}),
};

server.use(helmet());
server.use(cors({ credentials: true, origin: true }));
server.use(morgan('dev'));
server.use(express.json());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

server.get('/api/users', restricted, async (req, res) => {
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
			req.session.user = user;
			console.log(req);

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
				req.session.user = user;

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

server.get('/api/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(error => {
			res.send('Successfully logged out');
		});
	} else {
		req.end();
	}
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
