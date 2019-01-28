import Plyr from 'plyr';

window.addEventListener("load",function(event) {
    const players = Array.from(document.querySelectorAll('.c-player')).map(p => new Plyr(p));
},false);
