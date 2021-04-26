#!/usr/bin/env node

const {build} = require('./bin');

(async () => {
	await build();
})();
