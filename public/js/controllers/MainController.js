slotRacingSystemApp.controller('MainController', function($scope, $interval) {
    var socket = io.connect('http://localhost:9000', { 'forceNew': true });
    
    var hundreds1 = 0;
    var seconds1 = 0; 
    var minutes1 = 0;
    var hundreds2 = 0;
    var seconds2 = 0; 
    var minutes2 = 0;
    
    var last1 = '';
    var last2 = '';
    var best1 = '';
    var best2 = '';
    
    $scope.pilot1 = 'PILOT 1';
    $scope.pilot2 = 'PILOT 2';
    $scope.winner = '';
    $scope.haveWinner = false;
    $scope.running = false;
    
    $scope.laps = 5;
    $scope.laps1 = 0;
    $scope.laps2 = 0;
    
    $scope.time1 = '0:00:00';
    $scope.last1 = '0:00:00';
    $scope.best1 = '0:00:00';
    $scope.time2 = '0:00:00';
    $scope.last2 = '0:00:00';
    $scope.best2 = '0:00:00';
    
    // Start the race
    $scope.go = function() {
        hundreds1 = 0;
        seconds1 = 0; 
        minutes1 = 0;
        hundreds2 = 0;
        seconds2 = 0; 
        minutes2 = 0;
        
        $scope.running = true;
        $scope.haveWinner = false;
        $scope.laps1 = 0;
        $scope.laps2 = 0;

        time(1, minutes1, seconds1, hundreds1);
        time(2, minutes2, seconds2, hundreds2);

        $scope.last1 = '0:00:00';
        $scope.last2 = '0:00:00';
        $scope.best1 = '0:00:00';
        $scope.best2 = '0:00:00';
    }
    
    // Reset (and stops) the race
    $scope.reset = function() {
        $scope.running = false;
        $scope.haveWinner = false;
        
        hundreds1 = 0;
        seconds1 = 0; 
        minutes1 = 0;
        hundreds2 = 0;
        seconds2 = 0; 
        minutes2 = 0;
        
        $scope.laps1 = 0;
        $scope.laps2 = 0;
        
        time(1, minutes1, seconds1, hundreds1);
        time(2, minutes2, seconds2, hundreds2);
        $scope.last1 = format(minutes1, seconds1, hundreds1);
        $scope.last2 = format(minutes2, seconds2, hundreds2);
        $scope.best1 = format(minutes1, seconds1, hundreds1);
        $scope.best2 = format(minutes2, seconds2, hundreds2);
    }
    
    // Timings
    $scope.start = $interval(function () {
        if ($scope.running) {
            hundreds1++;
            hundreds2++;
        
            if (hundreds1 >= 100) {
                hundreds1 = 0;
            
                if (seconds1 >= 59) {
                    seconds1 = 0;
                    minutes1++;
                }
                else {
                    seconds1++;
                }
            }
            
            time(1, minutes1, seconds1, hundreds1);
            
            if (hundreds2 >= 100) {
                hundreds2 = 0;
            
                if (seconds2 >= 59) {
                    seconds2 = 0;
                    minutes2++;
                }
                else {
                    seconds2++;
                }
            }
        
            time(2, minutes2, seconds2, hundreds2);
        }
        
    }, 10);
    
    // Get sensors signals from node server and check race (winner?)
    socket.on('sensors', function(sensors) {
        if ($scope.running) {
            if (sensors[0].sensor1) {
                $scope.laps1++;
                $scope.last1 = format(minutes1, seconds1, hundreds1);
                
                if (($scope.best1 > $scope.last1) || ($scope.best1 == '0:00:00')) {
                    $scope.best1 = $scope.last1;
                }
                
                hundreds1 = 0;
                seconds1 = 0; 
                minutes1 = 0;
            }
            if (sensors[0].sensor2) {
                $scope.laps2++;
                $scope.last2 = format(minutes2, seconds2, hundreds2);
                
                if (($scope.best2 > $scope.last2) || ($scope.best2 == '0:00:00')) {
                    $scope.best2 = $scope.last2;
                }
                
                hundreds2 = 0;
                seconds2 = 0; 
                minutes2 = 0;
            }
            
            // Have a winner?
            if ($scope.laps1 == $scope.laps) {
                $scope.haveWinner = true;
                $scope.winner = $scope.pilot1;
                $scope.running = false;
            }
            else if ($scope.laps2 == $scope.laps) {
                $scope.haveWinner = true;
                $scope.winner = $scope.pilot2;
                $scope.running = false;
            }
        }
        
        time(1, minutes1, seconds1, hundreds1);
        time(2, minutes2, seconds2, hundreds2);
    })
    
    // Display times
    function time(lane, minutes, seconds, hundreds)
    {
        if (lane == 1) {
            $scope.time1 = format(minutes, seconds, hundreds);
        }
        else if (lane == 2) {
            $scope.time2 = format(minutes, seconds, hundreds);
        }
    } 
    
    // Format displaying time
    function format(minutes, seconds, hundreds)
    {
        var time = minutes;
        
        if (seconds < 10) {
            time += ':0' + seconds;
        }
        else {
            time += ':' + seconds;
        }
        
        if (hundreds < 10) {
            time += ':0' + hundreds;
        }
        else {
            time += ':' + hundreds;
        }
        
        return time;
    }
});