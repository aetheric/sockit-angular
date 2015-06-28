/* globals module, require */

(function() {

	function init(module, service) {

		return module.directive('form', [
			function() {

				return {
					restrict: 'E'
				};

			}
		]);

	}

	if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') {

		var sockitModule = require('./sockit-module');
		var sockitService = require('./sockit-service');

		module.exports = init(sockitModule, sockitService);

	} else if (typeof(define) !== 'undefined') {
		define('./sockit-module', './sockit-service', init);
	}

})();


