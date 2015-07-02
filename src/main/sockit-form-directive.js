/* globals module, require */

var sockitModule = require('./sockit-module');
var sockitService = require('./sockit-service');

module.exports = sockitModule.directive('form', [
	function() {

		return {
			restrict: 'E'
		};

	}
]);
