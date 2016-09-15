'use strict';

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['angular'], function(angular) {
      return factory(angular).name;
    });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('angular')).name;
  } else {
    factory(root.angular);
  }
})(this, function (angular) {
    return angular
        .module('$q-spread', [])
        .config(['$provide', function ($provide) {

            $provide.decorator('$q', ['$delegate', function ($delegate) {

                var originalDefer = $delegate.defer;

                $delegate.defer = function () {
                    // Get the prototype of the promise
                    var promiseProto = originalDefer().promise.constructor.prototype;

                    // Add the spread method
                    Object.defineProperty(promiseProto, 'spread', {
                        value: function (resolve, reject) {
                            function spread (data) {
                                return resolve.apply(void 0, data);
                            }

                            return this.then(spread, reject);
                        },
                        writable: true,
                        enumerable: false
                    });
                    
                    return originalDefer();
                };

                return $delegate;
            }]);
        }]);
});
