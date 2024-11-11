let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder;
    let x = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await x.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songlist");
    songUL.innerHTML="";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<div class="playlist">
                        <img src="svgs/music.svg" class="border">
                        <span>${song.replaceAll("%20", " ")}</span>
                        <span>Play Now</span>
                        <img src="svgs/play.svg" class="border"></div>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("div")).forEach(element => {
        element.addEventListener("click", () => {
            Array.from(document.querySelector(".songlist").getElementsByTagName("div")).forEach(ele => {
                ele.getElementsByTagName("span")[1].innerHTML = "Play Now";
                ele.getElementsByTagName("img")[1].src = "svgs/play.svg";
            });
            Playsong(element.getElementsByTagName("span")[0].innerHTML.trim());
        });
    });

    return songs;
}

const Playsong = (track,pause=false) => {
        currentsong.src = `/${currFolder}/` + track.replaceAll("%20", " ");
        if(!pause)
            {
                currentsong.play();
                play.src="svgs/pause.svg";
            }
        songid.innerText=track.replaceAll("%20", " ");
        songdur.innerText="00:00/00:00"
    }

async function main() {
    await getSongs("songs/Annamayya");
    Playsong(songs[0],true)

    play.addEventListener("click", () => {
        if(currentsong.paused)
            {
                currentsong.play();
                play.src="svgs/pause.svg";
            }
            else
            {
                currentsong.pause();
                play.src="svgs/play.svg";
            }
    });

    currentsong.addEventListener("timeupdate",()=>{
        songdur.innerText=`${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".ball").style.left=`${(currentsong.currentTime/currentsong.duration)*100}`+"%"
    });

    document.querySelector(".line").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".ball").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    previous.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split(`/${currFolder}/`)[1]);
        if(index>0 && index<=songs.length)
            {
                currentsong.pause();
                Playsong(songs[index-1]);
            }
    });

    next.addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src.split(`/${currFolder}/`)[1]);
        if(index>=0 && index<songs.length-1)
            {
                currentsong.pause();
                Playsong(songs[index+1]);
            }
    });

    volume.addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            volup.src = "svgs/volup.svg";
        }
    })

    document.querySelector("#volup").addEventListener("click", e=>{ 
        if(e.target.src.includes("volup.svg")){
            e.target.src = e.target.src.replace("volup.svg", "voloff.svg")
            currentsong.volume = 0;
            document.querySelector("#volume").value = 0;
        }
        else{
            e.target.src = e.target.src.replace("voloff.svg", "volup.svg")
            currentsong.volume = .10;
            document.querySelector("#volume").value = 10;
        }

    })

    Array.from(document.getElementsByClassName("album")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            Playsong(songs[0]);
        })
    })

    menu.addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    closing.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-180%"
    })

}

main()
