#!/usr/bin/env node

const {install} = require('./get-binary');

(async () => {
	await install();
})();
