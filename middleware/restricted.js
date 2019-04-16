module.exports = {
	restricted,
};

function restricted(req, res, next) {
	console.log('restricted', req.session);
	if (req.session && req.session.user) {
		console.log('restricted');
		next();
	} else {
		console.log('restricted else');
		res.status(400).json({ message: 'No credentials provided' });
	}
}
