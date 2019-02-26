exports.up = function(knex, Promise) {
	return knex.schema.createTable('brewery', function(table) {
		table.increments();
		table.string('brewery');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('brewery');
};
