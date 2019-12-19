const { config } = require('jovo-framework');

module.exports = config({
	logging: true,
	db: {
		FileDb: {
			pathToFile: './../db/db.json'
		}
	}
});
