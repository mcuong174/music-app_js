/*
1. Render songs
2. Scroll top
3. Play / Pause / Seek
4. CD rotate 
5. Next / Previous
6. Random
7. Next / Repeat when ended 
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAY_STRORAGE_KEY = 'MUSIC_PLAYER'

const player = $('.player');
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progressBar = $('.progress-bar');
const songCurrentTime = $('.current-time');
const songDurationTime = $('.duration-time');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const songPlayed = [0];

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STRORAGE_KEY)) || {},
    songs: [
        {
           name: 'Faded',
           singer: 'Alan Walker',
           path: './assets/music/song0.mp3',
           image: './assets/image/image0.jpg'
        },
        {
           name: 'Believer',
           singer: 'Imagine Dragons',
           path: './assets/music/song1.mp3',
           image: './assets/image/image1.jpg'
        },
        {
           name: 'Radioactive',
           singer: 'Imagine Dragons',
           path: './assets/music/song2.mp3',
           image: './assets/image/image2.jpg'
        },
        {
           name: 'Spectre',
           singer: 'Alan Walker',
           path: './assets/music/song3.mp3',
           image: './assets/image/image3.jpg'
        },
        {
           name: 'Basta Boi Remix',
           singer: 'Alfons',
           path: './assets/music/song4.mp3',
           image: './assets/image/image4.jpg'
        },
        {
           name: 'Havana',
           singer: 'Camila Cabello',
           path: './assets/music/song5.mp3',
           image: './assets/image/image5.jpg'
        },
        {
           name: 'Memories',
           singer: 'Maroon 5',
           path: './assets/music/song6.mp3',
           image: './assets/image/image6.jpg'
        },
        {
           name: 'Bones',
           singer: 'Imagine Dragons',
           path: './assets/music/song7.mp3',
           image: './assets/image/image7.jpg'
        },
        {
           name: 'Demons',
           singer: 'Imagine Dragons',
           path: './assets/music/song8.mp3',
           image: './assets/image/image8.jpg'
        },
        {
           name: 'Natural',
           singer: 'Imagine Dragons',
           path: './assets/music/song9.mp3',
           image: './assets/image/image9.jpg'
        },
        {
           name: 'Whatever it takes',
           singer: 'Imagine Dragons',
           path: './assets/music/song10.mp3',
           image: './assets/image/image10.jpg'
        },
        {
           name: 'Enemy',
           singer: 'Imagine Dragons',
           path: './assets/music/song11.mp3',
           image: './assets/image/image11.jpg'
        },
        {
           name: 'Sugar',
           singer: 'Maroon 5',
           path: './assets/music/song12.mp3',
           image: './assets/image/image12.jpg'
        },
        {
           name: 'Wellerman',
           singer: 'Nathen Evans',
           path: './assets/music/song13.mp3',
           image: './assets/image/image13.jpg'
        },
        {
           name: 'Masked Heroes',
           singer: 'Vexento',
           path: './assets/music/song14.mp3',
           image: './assets/image/image14.jpg'
        },
        {
           name: 'Nevada',
           singer: 'Vicetone',
           path: './assets/music/song15.mp3',
           image: './assets/image/image15.jpg'
        },
        {
           name: 'Warriors',
           singer: 'Imagine Dragons',
           path: './assets/music/song16.mp3',
           image: './assets/image/image16.jpg'
        },
     ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAY_STRORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="singer">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('');
    },

    // define th??m thu???c t??nh c???a object app
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // L???y c??i width hi???n t???i c???a cd
        // Tr??? ??i s??? px khi oncroll
        // check xem k???t qu??? c?? >0 kh??ng
        // ch?? ??: khi c?? k???t qu??? th?? g??n l???i cho cd.style.width ch??? kh??ng ph???i l?? cdWidth, vif offsetWidth ch??? l?? read-only
        //  ch?? ?? khi set k??ch th?????c cho width ph???i + 'px'

        // X??? l?? CD quay / d???ng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // X??? l?? ph??ng to/ thu nh??? CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // X??? l?? khi click play
        // khi ch???y l???n ?????u isplaying l?? false,
        // th?? l???t v??o audio.play v?? ch???y xu???ng onplay,
        // sau ???? onclick l???n n???a, n?? s??? ki???m tra l???i isplay l?? true, th?? n?? l???t v??o audio.pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi song ???????c play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song b??? pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // khi ti???n ????? b??i h??t thay ?????i
        /* C??ch 1
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        */
        //C??ch 2:
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime * 100) / audio.duration
                );
                progressBar.value = progressPercent;
                progressBar.style.background = `linear-gradient(to right, #ff2a5f ${progressPercent}%, #ccc 0%)`;

                // X??? l?? ti???n ?????
                const minutesCurrent =
                    Math.floor(audio.currentTime / 60) <= 9 ?
                    '0' + Math.floor(audio.currentTime / 60) :
                    Math.floor(audio.currentTime / 60);

                const secondsCurrent =
                    Math.floor(audio.currentTime - minutesCurrent * 60) <= 9 ?
                    '0' + Math.floor(audio.currentTime - minutesCurrent * 60) :
                    Math.floor(audio.currentTime - minutesCurrent * 60);

                const minutesDuration =
                    Math.floor(audio.duration / 60) <= 9 ?
                    '0' + Math.floor(audio.duration / 60) :
                    Math.floor(audio.duration / 60);

                const secondsDuration =
                    Math.floor(audio.duration - minutesDuration * 60) <= 9 ?
                    '0' + Math.floor(audio.duration - minutesDuration * 60) :
                    Math.floor(audio.duration - minutesDuration * 60);
                    
                songCurrentTime.innerText = minutesCurrent + ':' + secondsCurrent;
                songDurationTime.innerText = minutesDuration + ':' + secondsDuration;
            }
        };

        // X??? l?? khi tua song
        progressBar.oninput = function (e) {
            const seek = audio.duration / 100 * e.target.value;
            //const seek = (e.target.value * audio.duration) / 100;
            audio.currentTime = seek;
        }

        // X??? l?? next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.scrollToActiveSong()
            //_this.render()
            _this.activeSong();
            audio.play()
        }

        // X??? l?? prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.scrollToActiveSong()
            //_this.render()
            _this.activeSong();
            audio.play()
        }

        // X??? l?? random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // X??? l?? next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // X??? l?? l???p l???i song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // X??? l?? l???ng nghe h??nh vi click v??o playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if (songNode || optionNode) {
                // X??? l?? khi click v??o song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.activeSong();
                    //_this.render();
                    audio.play();
                }
                //     // X??? l?? khi click v??o song option
                //     // if(e.target.closest('.option')){
                //     // }
            }
        }
    },

    // x??? l?? danh s??ch b??i h??t l???p l???i
    activeSong: function () {
        const allSong = $$('.song');
        for (const element of allSong) {
            element.classList.remove('active');
            $(`[data-index='${this.currentIndex}']`).classList.add('active');
        }
    },


    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300)
    },

    loadCurrentSong: function () {
        if (this.currentSong) {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        }
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    /* C??ch 1: L??m function Random song
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    */

    // C??ch 2: L??m function Random song 
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
            //} while (newIndex === this.currentIndex)
        } while (songPlayed.includes(newIndex) === true)
        // logic ch??? do ..while, l?? random 1 s???, ?????n khi s??? ???? b???ng s??? hi???n t???i th?? d???ng
        // ch??? kh??ng ph???i l?? random 1 s??? ?????n khi n?? kh??c s??? tr?????c ???? th?? d???ng >>>hi???u sai

        this.currentIndex = newIndex
        songPlayed.push(newIndex);

        // Khi m???ng c?? s??? l?????ng index = s??? l?????ng b??i h??t th?? clear m???ng
        if (songPlayed.length === this.songs.length) {
            songPlayed = []
        }

        this.loadCurrentSong()
    },

    start: function () {
        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        // ?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties();

        // L???ng nghe v?? x??? l?? c??c s??? ki???n (DOM event)
        this.handleEvent();

        // T???i th??ng tin b??i h??t ?????u ti??n v??o UI khi ch???y ???ng d???ng
        this.loadCurrentSong();

        // Render playList
        this.render();

        // Hi???n th??? tr???ng th??i ban ?????u c???a button random v?? repeat
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);

    }
}

app.start();