/* README: https://github.com/foreverjs/forever */
var http = require('http'),
	request = require('request'),
	cheerio = require('cheerio'),
	url = 'http://www.gibraltarairport.gi/content/live-flight-info',
	data = {
		arrivals:   {},
		departures: {},
		lastChecked: ''
	},
	timeCached = new Date('2000-01-01');

function getData(type, callback) {
	request(url, function(error, response, body) {
		if(error) {
			callback(false);
		}
		else {
			data[type] = {};
			
			var $ = cheerio.load(body),
					$tables = $('.tab-' + type + ' .flight-info-tables'),
					items = [];

			$tables.each(function() {
				var date = $(this).find('h2').text();

				if(!data[type][date]) {
					items = [];

					$(this).find('tr').each(function() {
						var tds = $(this).find('td');

						if(tds.length) {
							items.push({
								time: tds.eq(0).text(),
								place: tds.eq(3).text(),
								status: tds.eq(4).text()
							});
						}
					});

					data[type][date] = items;
				}
			});

			callback(true);
		}
	});
}

http.createServer(function(req, res) {
	if(req.url.indexOf('favicon') != -1) {
		res.end();
		return;
	}

	res.setHeader('content-type', 'text/json');

	var resText = '',
		theTime = new Date();

	if(timeCached.getMinutes() != theTime.getMinutes()) {
		console.log('Caching data');

		getData('arrivals', function(e) {
			if(!e) {
				res.end('{}');
			}
			else {
				getData('departures', function(e) {
					if(!e) {
						res.end('{}');
					}
					else {
						res.end(JSON.stringify(data));
					}
				});
			}
		});

		timeCached = theTime;
		data['lastChecked'] = timeCached.getUTCDate() + '/' + (timeCached.getUTCMonth() + 1) + '/' + timeCached.getUTCFullYear() + ' ' + timeCached.getUTCHours() + ':' + timeCached.getUTCMinutes() + ' GMT';
	}
	else {
		console.log('Data already cached.');
		res.end(JSON.stringify(data));
	}
}).listen(8888);