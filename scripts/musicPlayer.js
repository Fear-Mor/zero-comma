$(document).ready(function () {
    const tracks = [
        {
            name: "TIME",
            artist: "Condor44",
            src: "audio/TIME-condor44.opus",
            link: "https://www.youtube.com/watch?v=mg8ZBRfwn78",
        },
        {
            name: "October",
            artist: "Boyz & Girl",
            src: "audio/October-Boyz&Girl.opus",
            link: "https://www.youtube.com/watch?v=cpyFJ5ZEkU4"
        },
        {
            name: "00203",
            artist: "Condor44",
            src: "audio/00203-Condor44.opus",
            link: "https://www.youtube.com/watch?v=DT1h_u33ByQ"
        },
        {
            name: "Las Golondrinas de Plaza de Mayo",
            artist: "Invisible",
            src: "audio/LasGolondrinasdePlazadeMayo-Invisible.opus",
            link: "https://www.youtube.com/watch?v=mCxvdC135DE"
        },
        {
            name: "Summer's Gone -second season ver-",
            artist: "Honeydip",
            src: "audio/Summer'sGone-secondseasonver--Honeydip.opus",
            link: "https://www.youtube.com/watch?v=Awiu4T8xUbw"
        },
        {
            name: "7月",
            artist: "bloodthirsty butchers",
            src: "audio/July-bloodthirstybutchers.opus",
            link: "https://www.youtube.com/watch?v=ROW1QeuKmxk"
        },
        {
            name: "星期天大街",
            artist: "Soundtoy",
            src: "audio/星期天大街-Soundtoy.opus",
            link: "https://www.youtube.com/watch?v=CQFt7rB7AfU"
        }
    ];

    const $player = $("#player");
    const $trackName = $("#trackname");
    const $trackNumDisplay = $("#tracknum");
    const $audioElement = $("#audioelement");
    const $prevTrackIcon = $("#prevtrack");
    const $nextTrackIcon = $("#nexttrack");
    const $pauseIcon = $("#stoptrack");
    const $playIcon = $("#playtrack");
    const $progressBar = $("#progressbar");
    const $volumeBar = $("#volumebar");
    const $currentTime = $("#currenttime");
    const $totalTime = $("#totaltime");
    const $randomIcon = $("#random");
    const $togglePlaylist = $("#toggleplaylist");
    const $playlistWindow = $("#playlistwindow");
    const $playlist = $("#playlist");
    const $container = $("#tracknamecontainer");
    const $text = $("#trackname");

    let trackNum = 0;
    let isPlaying = false;
    let hasLoaded = false;
    let updateTimer;

    renderPlaylist();
    checkOverflow();

    function loadTrack(num) {
        clearInterval(updateTimer);
        $currentTime.text("0:00");
        $totalTime.text("0:00");
        $progressBar.val(0);
        setSlider("volume");

        $audioElement.attr("src", tracks[num].src);
        $audioElement[0].load();

        $trackName.html(`<a href="${tracks[num].link}" target="_blank">${tracks[num].name} / ${tracks[num].artist}</a>`);
        $trackNumDisplay.text(num < 9 ? `0${num + 1}` : `${num + 1}`);
        checkOverflow();

        updateTimer = setInterval(progressUpdate, 500);
    }

    function renderPlaylist() {
        $playlist.empty();
        tracks.forEach((track, index) => {
            const isActive = index === trackNum ? "active" : "";
            const listNumber = index < 9 ? `0${index + 1}` : `${index + 1}`;
            const $trackItem = $(`<div class="playlistitem ${isActive}" data-index="${index}"><span class="listnum">${listNumber}</span><span class="listtitle">${track.name}</span><span class="listartist">${track.artist}</span></div>`);

            $trackItem.on("click", function () {
                trackNum = index;
                loadTrack(trackNum);
                setPlaybackState("play");
                renderPlaylist();
            });
            $playlist.append($trackItem);
        });
    }

    function setPlaybackState(state) {
        if (state === "play") {
            $audioElement[0].play();
            isPlaying = true;
        } else if (state === "pause") {
            $audioElement[0].pause();
            isPlaying = false;
        }
    }

    function changeTrack(direction) {
        if (direction === "next") {
            trackNum = (trackNum + 1) % tracks.length;
        } else if (direction === "prev") {
            trackNum = (trackNum - 1 + tracks.length) % tracks.length;
        }

        loadTrack(trackNum);
        setPlaybackState("play");
        renderPlaylist();
    }

    function setSlider(type) {
        if (type === "time") {
            $audioElement[0].currentTime = $audioElement[0].duration * ($progressBar.val() / 100);
        } else if (type === "volume") {
            $audioElement[0].volume = $volumeBar.val() / 100;
        }
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    function progressUpdate () {
        let progress = 0;

        if(!isNaN($audioElement[0].duration)) {
            progress = ($audioElement[0].currentTime / $audioElement[0].duration) * 100;
            $progressBar.val(progress);

            $currentTime.text(formatTime($audioElement[0].currentTime));
            $totalTime.text(formatTime($audioElement[0].duration));
        }
    }

    function checkOverflow() {
        if ($text[0].scrollWidth > $container[0].clientWidth) {
            $container.addClass("indented");
            $text.addClass("animate");
        } else {
            $container.removeClass("indented");
            $text.removeClass("animate");
        }
    }

    $(window).on("resize", function () { checkOverflow(); });
    $audioElement.on("ended", function () {
        if (trackNum !== tracks.length - 1) {
            changeTrack("next");
        } else {
            trackNum = 0;
            loadTrack(trackNum);
            renderPlaylist();
        }
    });
    $prevTrackIcon.on("click", function () { changeTrack("prev"); });
    $nextTrackIcon.on("click", function () { changeTrack("next"); });
    $pauseIcon.on("click", function () {
        setPlaybackState("pause");
        $trackName.text("------");
        $trackNumDisplay.text("--");
        checkOverflow();
    });
    $playIcon.on("click", function() {
        if (!hasLoaded) {
            loadTrack(trackNum);
            hasLoaded = true;
        }
        setPlaybackState("play");
        $trackName.html(`<a href="${tracks[trackNum].link}" target="_blank">${tracks[trackNum].name} / ${tracks[trackNum].artist}</a>`);
        $trackNumDisplay.text(trackNum < 9 ? `0${trackNum + 1}` : `${trackNum + 1}`);
        checkOverflow();
    });
    $volumeBar.on("input", function () { setSlider("volume"); });
    $randomIcon.on("click", function () {
        $randomIcon.toggleClass("active");
        setTimeout(() => $randomIcon.removeClass("active"), 150);
        trackNum = Math.floor(Math.random() * tracks.length);
        loadTrack(trackNum);
        setPlaybackState("play");
        renderPlaylist();
    });
    $togglePlaylist.on("click", function () {
        if (!$playlistWindow.is(":visible")) {
            $togglePlaylist.toggleClass("active");
            setTimeout(() => $togglePlaylist.removeClass("active"), 150);

            const playerOffset = $player.offset();
            const playerWidth = $player.outerWidth();
            const playlistWidth = $playlistWindow.outerWidth();
            const windowWidth = $(window).width();

            let leftPosition;

            if (playerOffset.left + playerWidth + playlistWidth + 10 <= windowWidth) {
                leftPosition = playerOffset.left + playerWidth + 5;
            } else {
                leftPosition = playerOffset.left - playlistWidth - 15;
            }

            $playlistWindow.css({
                position: "absolute",
                top: playerOffset.top - 5,
                left: leftPosition
            });

            $playlistWindow.show();
        } else {
            $togglePlaylist.toggleClass("active");
            setTimeout(() => $togglePlaylist.removeClass("active"), 150);
            $playlistWindow.hide();
        }
    });
    $progressBar.on("input", function () { setSlider("time"); });
    $playlistWindow.find(".close").on("click", function () { $playlistWindow.hide(); });
});
