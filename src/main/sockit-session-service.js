/* globals module, require, Promise */

var sockit = require('./sockit-module');

module.exports = sockit.provider('$sockit', [
	'$windowProvider',
	function ($windowProvider) {
		var $provider = {};

		$provider.$get = [
			'$http', '$window',
			function ($http, $window) {
				var $service = {};

				function value(key, value) {

					if (value === null) {
						delete $window.sessionStorage[key];

					} else if (typeof(value) !== 'undefined') {
						$window.sessionStorage[key] = JSON.stringify(value);

					}

					return JSON.parse($window.sessionStorage[key]);

				}

				/**
				 * Load an object or collection from the session storage, optionally saving a new one.
				 * @param {String|Function} path The location to load/store the value.
				 * @param {Object|Function|Promise} [input] If provided, will store the object, the resolution of the
				 *                                          function, or the resolution of the promise.
				 * @returns {Object|Promise} Will return the value stored at the path, or a promise if the input is
				 *                           also a promise.
				 */
				$service.store = function store(path, input) {

					var key = typeof(path) === 'function'
						? path()
						: path;

					if (typeof(input) === 'undefined') {
						return value(key);
					}

					if (input === null) {
						return value(key, null);
					}

					if (typeof(input) === 'function') {
						return value(input());
					}

					if (typeof(input.then) === 'function') {
						input.then(function (value) {
							return store(key, value);
						});
					}

					return value(key, input);

				};

				return $service;
			}
		];

		return $provider;
	}
]);
