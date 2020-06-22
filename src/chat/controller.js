const Interface = (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
};

module.exports = { Interface };
