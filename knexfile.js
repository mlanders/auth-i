// Update with your config settings.

module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './auth.sqlite3',
		},
		useNullAsDefault: null,
	},
};
