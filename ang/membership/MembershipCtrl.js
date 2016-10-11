(function(angular, $, _) {

  angular.module('membership').config(function($routeProvider) {
      $routeProvider.when('/membership/filter', {
        controller: 'MembershipMembershipCtrl',
        templateUrl: '~/membership/MembershipCtrl.html',

        // If you need to look up data when opening the page, list it out
        // under "resolve".
        // resolve: {
        //   memberships: function(crmApi) {
        //     return crmApi('option_value', 'getlist', {params: {option_group_id: 'relative_date_filters', options: {sort:'weight'}}});
        //   }
        // }

        resolve: {
          memberships: function(crmApi) {
            return crmApi('Membership', 'get', {
              'api.Contact.getsingle': { 'return' : 'display_name'},
              'sequential' : 1
            });
          }
        }
      });
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   memberships -- The current contact, defined above in config().
  angular.module('membership').controller('MembershipMembershipCtrl', function($scope, crmApi, crmStatus, crmUiHelp, memberships) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts  = CRM.ts('membership');
    var hs = $scope.hs  = crmUiHelp({file: 'CRM/membership/MembershipCtrl'}); // See: templates/CRM/membership/MembershipCtrl.hlp

    $scope.clearFilters = function ()
    {
      $scope.filters    = {};

      return true;
    }

    $scope.filterMembership = function ()
    {
      return function(membership) {
        return (!$scope.filters.start || membership.start_date >= $scope.filters.start) && (!$scope.filters.end || membership.start_date <= $scope.filters.end);
      };
    };

    $scope.sortBy       = function (property)
    {
      if (property === $scope.sort) {
        $scope.sortReverse  = !$scope.sortReverse;
        $scope.sort         = $scope.sortReverse === false ? null : $scope.sort;
      } else {
        $scope.sort         = property;
        $scope.sortReverse  = false;
      }

      return true;
    }

    // Saving and parsing memberships queried to scope
    $scope.memberships  = [];
    $scope.sort         = null;
    angular.forEach(memberships.values, function(membership, key) {
      membership.display_name  = membership['api.Contact.getsingle']['display_name'];
      $scope.memberships.push(membership);
    });
    $scope.clearFilters();

  });

})(angular, CRM.$, CRM._);
