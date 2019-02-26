module.exports = {
	restricted,
};

function restricted(req, res, next) {
	if (req.session && req.session.username) {
		next();
	} else {
		res.status(400).json({ message: 'No credentials provided' });
	}
}
