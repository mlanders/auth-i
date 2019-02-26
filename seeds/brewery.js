exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex('brewery')
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex('brewery').insert([
				{ brewery: 'Sierra Nevada' },
				{ brewery: 'Track 7' },
				{ brewery: 'Anchor Steam' },
			]);
		});
};
