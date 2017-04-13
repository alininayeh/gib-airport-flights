angular
  .module('flightScheduleApp', [])
  .controller('flightScheduleAppData', function($scope, $http) {
    $http.get('/data').then(function(response) {
      var arrivals = response.data.arrivals,
          departures = response.data.departures,
          all = {};

      angular.forEach(arrivals, function(value, key) {
        angular.forEach(arrivals[key], function(value, i) {
          arrivals[key][i].type = 'arrival';

          if(arrivals[key][i].status.indexOf('Arrived') != -1) {
            arrivals[key][i].statusClass = 'success';
          }
          else {
           arrivals[key][i].statusClass = ''; 
          }
        });
      });

      angular.forEach(departures, function(value, key) {
        angular.forEach(departures[key], function(value, i) {
          departures[key][i].type = 'departure';

          if(departures[key][i].status.indexOf('Departed') != -1) {
            departures[key][i].statusClass = 'success';
          }
          else {
           departures[key][i].statusClass = ''; 
          }
        });

        all[key] = arrivals[key].concat(departures[key]);
        
        all[key].sort(function(a, b) {
          return parseInt(a.time.replace(':', '')) - parseInt(b.time.replace(':', ''));
        });
      });

      $scope.showAll = function() {
        $('.flightScheduleApp-menu-item.selected').removeClass('selected');
        $('.flightScheduleApp-menu-item.showAll').addClass('selected');
        localStorage.setItem('showFlights', 'all');
        $scope.items = all;
        $scope.title = 'All Gibraltar flights';
      }

      $scope.showToday = function() {
        $('.flightScheduleApp-menu-item.selected').removeClass('selected');
        $('.flightScheduleApp-menu-item.showToday').addClass('selected');
        localStorage.setItem('showFlights', 'today');
        var items = {};
        
        for(today in all) {
          items[today] = all[today];
          $scope.items = items;
          $scope.title = 'Today\'s Gibraltar flights';
          break;
        }
      }

      $scope.showArrivals = function() {
        $('.flightScheduleApp-menu-item.selected').removeClass('selected');
        $('.flightScheduleApp-menu-item.showArrivals').addClass('selected');
        localStorage.setItem('showFlights', 'arrivals');
        $scope.items = arrivals;
        $scope.title = 'Arrivals to Gibraltar';
      }

      $scope.showDepartures = function() {
        $('.flightScheduleApp-menu-item.selected').removeClass('selected');
        $('.flightScheduleApp-menu-item.showDepartures').addClass('selected');
        localStorage.setItem('showFlights', 'departures');
        $scope.items = departures;
        $scope.title = 'Departures from Gibraltar';
      }

      switch(localStorage.getItem('showFlights')) {
        case 'all':
          $scope.showAll();
          break;
        case 'today':
          $scope.showToday();
          break;
        case 'arrivals':
          $scope.showArrivals();
          break;
        case 'departures':
          $scope.showDepartures();
          break;
        default:
          $scope.showAll();
          break;
      }

      checkNotifications(all);
      $('.flightScheduleApp-header, .flightScheduleApp-menuButton, .flightScheduleApp-list').show();
    });
  });