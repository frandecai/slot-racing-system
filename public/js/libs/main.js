var socket = io.connect('http://localhost:8080', { 'forceNew': true });

var laps = [{
    laps1: 0,
    laps2: 0}];

socket.on('laps', function(laps) {
    renderLaps(laps);
})

function renderLaps (laps) {
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="cars.mp3" type="audio/mpeg" /><source src="cars.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="cars.mp3" /></audio>';    
    document.getElementById('laps1').innerHTML = 'LAPS 1: ' + laps[0].laps1;
    document.getElementById('laps2').innerHTML = 'LAPS 2: ' + laps[0].laps2;
}

