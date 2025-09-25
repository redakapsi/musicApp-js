let inputfile = document.getElementById('inputfile');
let addsong = document.getElementById('addsong');
let list = document.querySelector('.list');
let player = document.getElementById('player');
let onoff = document.getElementById('onoff');
let songname = document.getElementById('songname');
let pauseBtn = document.getElementById('pause');
let timeline = document.getElementById('timeline');
let songtime = document.getElementById('songtime');
let backward = document.getElementById('backward');
let forward = document.getElementById('forward');

let currentindex = 0;
let songs = [];

addsong.onclick = () => inputfile.click();

pauseBtn.onclick = function () {
    if (player.paused) {
        player.play();
        pauseBtn.classList.remove('bi-play-fill');
        pauseBtn.classList.add('bi-pause-circle-fill');
        onoff.textContent = 'Music Playing';
    } else {
        player.pause();
        pauseBtn.classList.remove('bi-pause-circle-fill');
        pauseBtn.classList.add('bi-play-fill');
        onoff.textContent = 'Music Paused';
    }
};

// Add songs
inputfile.addEventListener("change", (event) => {
    const files = event.target.files;
    for (let file of files) {
        const url = URL.createObjectURL(file);
        songs.push({ name: file.name, url: url });
        playMusic(file.name, url, songs.length - 1);
    }
    localStorage.setItem('listedSongs', JSON.stringify(songs));
});

// Load songs & last index on reload
window.addEventListener('load', () => {
    let saved = localStorage.getItem('listedSongs');
    let savedIndex = localStorage.getItem('currentIndex');

    if (saved) {
        songs = JSON.parse(saved);
        songs.forEach((song, index) => {
            playMusic(song.name, song.url, index);
        });

        if (songs.length > 0) {
            currentindex = savedIndex ? parseInt(savedIndex) : 0;
            let song = songs[currentindex];
            player.src = song.url;
            songname.textContent = song.name;
            onoff.textContent = 'Click ▶ to play';
            pauseBtn.classList.add('bi-play-fill');
        }
    }
});

function playMusic(name, url, index) {
    let div = document.createElement('div');
    div.innerHTML = name;
    div.addEventListener('click', () => {
        onoff.textContent = 'Music Playing';
        songname.textContent = name;
        player.src = url;
        currentindex = index;
        player.play();
        pauseBtn.classList.remove('bi-play-fill');
        pauseBtn.classList.add('bi-pause-circle-fill');
        localStorage.setItem('currentIndex', currentindex);
    });
    list.appendChild(div);
}

setInterval(function () {
    let current = Math.floor(player.currentTime);
    let minutes = Math.floor(current / 60);
    let seconds = current % 60;
    let formattedSeconds = String(seconds).padStart(2, '0');
    songtime.textContent = `${minutes}:${formattedSeconds}`;
}, 500);

player.addEventListener('timeupdate', () => {
    let value = (player.currentTime / player.duration) * 100;
    timeline.value = value || 0;
});

timeline.addEventListener('input', function () {
    player.currentTime = (timeline.value / 100) * player.duration;
});

function playCurrentSong() {
    let song = songs[currentindex];
    if (!song) return;
    player.src = song.url;
    player.play();
    onoff.textContent = 'Music Playing';
    pauseBtn.classList.remove('bi-play-fill');
    pauseBtn.classList.add('bi-pause-circle-fill');
    songname.textContent = song.name;
    localStorage.setItem('currentIndex', currentindex);
}

forward.addEventListener('click', function () {
    if (songs.length === 0) return;
    currentindex++;
    if (currentindex >= songs.length) currentindex = 0;
    playCurrentSong();
});

backward.addEventListener('click', function () {
    if (songs.length === 0) return;
    currentindex--;
    if (currentindex < 0) currentindex = songs.length - 1;
    playCurrentSong();
});
