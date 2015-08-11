/* globals module, require, Promise */

var sockit = require('./sockit-module');

module.exports = sockit.provider('$sockit', [
	'$windowProvider',
	function($windowProvider) {
		var $provider = {};

		var root = $windowProvider.location.replaceAll(new RegExp('^(.+?)#?.*$'));

		var listeners = {};

		var cache = {};

		$provider.$get = [
			'$rootScope', '$http', '$window', '$session',
			function ($root, $http, $window, $session) {
				var $service = {};

				/**
				 * Provides access to a resource.
				 * @param {String|Function} path The HATEOAS path of a resource.
				 * @param {Function} [onChange] Callback invoked each time the resource data changes.
				 * @returns {Promise} A promise for when the collection is resolved.
				 */
				$service.resource = function (path, onChange) {

					var key = typeof(path) === 'function'
						? path()
						: path;

					if (onChange && typeof(onChange) === 'function') {
						(listeners[key] || (listeners[key] = [])).push(onChange);
					}

					var resource = cache[key];
					if (resource && resource.$options) {
						return resource.$options().then(function() {
							return resource;
						});
					}

					// Retrieve or create a new resource, then cache it.
					resource = $session.store(key) || {};
					cache[key] = resource;

					// if there are any stored results, resolve them immediately
					for (var item in resource) {
						if (resource.hasOwnProperty(item) && !item.indexOf('_')) {
							var promiseKey = item.splice(0, 1, '$');
							resource[promiseKey] = Promise.resolve(resource[item]);
						}
					}

					if (resource.$options) {
						return $options();
					}

					function processLink(action, link) {
						resource['_' + action] = link;
						resource['$' + action] = function(params, data) {
							return $http({
								method: link.method,
								params: params || {},
								data: data,
								headers: {
									'etag': resource.etag,
									'Accept': resource.mime,
									'Content-Type': 'application/json'
								}
							});
						}
					}

					resource.$options = function() {
						return $http({
							url: root + key,
							method: 'OPTIONS',
							headers: {
								'etag': resource.etag,
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							}
						}).then(function(response) {

							// Make sure to save the content hash for caching.
							resource.etag = response.header("etag") || resource.etag;

							for (var action in response.data) {
								if (response.data.hasOwnProperty(action)) {
									processLink(action, response.data[action]);
								}
							}

							return resource;

						});
					};

					return resource.$options();

				};

				return $service;
			}
		];


		return $provider;
	}
]);
