particlesJS("particles-js", {
    particles: {
        number: { value: 200, density: { enable: true, value_area: 800 } },
        color: { value: ["#fff", "#7c7c7c", "#222222"] },
        shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 100, height: 100 }
        },
        opacity: {
            value: 1,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: true, speed: 0.5, size_min: 0.3, sync: false }
        },
        line_linked: {
            enable: false,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 600 }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "repulse" },
            resize: true
        },
        modes: {
            grab: { distance: 170, line_linked: { opacity: 1 } },
            bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 },
            repulse: { distance: 295.7042957042957, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

var coinList = [];
var results = document.getElementById("results");
var textarea = document.getElementById("embedCode");

document.getElementById("searchBar").addEventListener("keyup", ()=>{
    if (event.key === 'Enter') {search();}
});
fetch(`/coinList`)
.then(response => response.json())
.then(data => {
    console.log(typeof(coinList))
    coinList.push(data.coinList);
    console.log(coinList)
})

function search(){
    var lookup = document.getElementById("searchBar").value;
    results.innerHTML = "";
    coinList[0].forEach(coin => {
        if (coin.symbol == lookup){
            let div = document.createElement('div');
            div.setAttribute('class', 'result');
            div.innerHTML = `<a href="#" onclick="iframe('${coin.id}');return false;">${coin.id}</a>`
            results.appendChild(div)
        }
        // else if(coin.name.startsWith(lookup)){
        //     console.log(coin)
        // }
    })
}

function iframe(id){
    results.innerHTML = "";
    embedCode = `<iframe 
    src="${document.location.origin}/coin?name=${id}" style="min-height: 220px; min-width: 310px; overflow:hidden;" scrolling="auto" frameborder="0" border="0">Your browser does not support iframes.</iframe>`
    document.querySelector(".widgetContainer").innerHTML = embedCode;
    textarea.innerText = embedCode;
    textarea.hidden = false;
    document.getElementById("copy").hidden = false;
}

document.querySelector("#copy").addEventListener("click", copy);

function copy(){
    textarea.select();
    document.execCommand("copy");
    document.getSelection().removeAllRanges();
}