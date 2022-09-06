const package_json = require('../package.json')

/*
* 	test: curl -H "Content-Type: application/json" -X GET http://localhost/PREFIX/ping
*/

exports.ping = function(req, res) {

	const version = package_json.version
	const name = package_json.name

	res.json({data: 'pong - '+name+ ' v:'+version});

};
