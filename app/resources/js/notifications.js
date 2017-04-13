function showNotification(text) {
  setTimeout(function() {
    $('.flightScheduleApp-notification-text').html(text)
    $('.flightScheduleApp-notification').fadeIn();
  }, 1000);

  setTimeout(function() {
    $('.flightScheduleApp-notification').fadeOut(1000); 
  }, 6000);
}

function checkNotifications(items) {
  var now = new Date(),
      timeNow, timeThen, timeDiff, flight, time, today, flightTime;

  if(now.toString().indexOf('(CET)') != -1 || now.toString().indexOf('(CEST)') != -1) {
    for(var key in items) {
      today = items[key];
      break;
    }

    for(var i = 0, n = today.length; i < n; i++) {
      flight = today[i];
      timeNow = now.getHours() * 60 + now.getMinutes();

      if(flight.status.indexOf('Arrived') != -1 || flight.status.indexOf('Departed') != -1) {
        continue;  
      }

      if(flight.status.indexOf('Estimated') != -1 && flight.status.indexOf(':') != -1) {
        timeThen = parseInt(flight.status.split(' ')[1].split(':')[0]) * 60 + parseInt(flight.status.split(' ')[1].split(':')[1]);
        flightTime = flight.status.split(' ')[1];
      }
      else {
        timeThen = parseInt(flight.time.split(':')[0]) * 60 + parseInt(flight.time.split(':')[1]);
        flightTime = flight.time;
      }
      
      timeDiff = timeThen - timeNow;

      if(timeDiff > 0 && timeDiff <= 30) {
        if(flight.status != 'Diverted') {
          if(flight.type == 'arrival') {
            showNotification('A plane will land from ' + flight.place + ' at ' + flightTime + '.');
          }
          else {
           showNotification('A plane will take off to ' + flight.place + ' at ' + flightTime + '.');
          }

          break;
        }
      }
    }
  }
}