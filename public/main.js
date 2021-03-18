particlesJS("particles-js", {
    particles: {
        number: { value: 160, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
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
            anim: { enable: false, speed: 4, size_min: 0.3, sync: false }
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
document.getElementById("searchBar").addEventListener("keyup", ()=>{
    if (event.key === 'Enter') {search();}
});
fetch(`https://api.coingecko.com/api/v3/coins/list`)
.then(response => response.json())
.then(data => {
    console.log(typeof(coinList))
    coinList.push(data);
    console.log(coinList)
})

function search(){
    var lookup = document.getElementById("searchBar").value;
    results.innerHTML = "";
    coinList[0].forEach(coin => {
        if (coin.symbol == lookup){
            console.log(coin)
            let div = document.createElement('div');
            div.setAttribute('class', 'coin-container');
            div.innerHTML = `<a href="#" onclick="widget('${coin.id}');return false;">${coin.id}</a>`
            results.appendChild(div)
        }
        // else if(coin.name.startsWith(lookup)){
        //     console.log(coin)
        // }
    })
}

//TODO Check CG total supply vs max supply
function widget(id){
    fetch(`https://api.coingecko.com/api/v3/coins/${id}?tickers=false&community_data=false&developer_data=false&sparkline=false`)
    .then(response => response.json())
    .then(data => {
        let formattedPrice =  (data.market_data.current_price.usd > 10 ? data.market_data.current_price.usd.toLocaleString() : data.market_data.current_price.usd);
        let maxSupply =  (data.market_data.max_supply == null ? "N/A": data.market_data.max_supply.toLocaleString());
        let circulatingSupply = (data.market_data.circulating_supply == null ? "N/A": data.market_data.circulating_supply.toLocaleString());
        let mcap = (data.market_data.market_cap.usd == null ? "N/A": data.market_data.market_cap.usd.toLocaleString());
        // try to implement a table td style html
        let div = document.createElement('div');
        div.setAttribute('class', 'top-row');
        div.innerHTML =`                       
        <div class="grid-container">
            <div class="grid-item-1">
                <img id="logo" style="width:48px;height:48px;" src="${data.image.small}" alt="Coin logo">
            </div>
            <div class="grid-item-2">
                <div>
                    <span id="name" style="style="font-size: 14px;"">${data.name}</span>
                    <span id="ticker" style="font-size:10px; color:grey; font-weight:500">[${data.symbol}]</span>
                </div>
                <div id="rank" style="font-size: 10px; color: grey;">Rank: ${data.coingecko_rank}</div>
            </div>
            <div class="grid-item-3">
                <div id="price" style="font-weight: 700;">$${formattedPrice}</div>    
            </div>
            <div class="grid-item-4">
                <div style="font-size: 10px; color: grey;">24h low / 24h high</div>
                <div id="range" style="font-size: 12px;">$${data.market_data.low_24h.usd} / $${data.market_data.high_24h.usd}</div>
            </div>
            <div class="grid-item-5">
                <div style="font-size: 10px; color: grey;">24h volume</div>
                <div id="volume" style="font-size: 12px;">$${data.market_data.total_volume.usd.toLocaleString()}</div>
            </div>
            <div class="grid-item-6">
                <div style="font-size: 10px; color: grey;">Circulating / Total supply</div>
                <div id="supply" style="font-size: 12px;">${circulatingSupply} / ${maxSupply}</div>
            </div>
            <div class="grid-item-7">
                <div style="font-size: 10px; color: grey;">Market cap</div>
                <div  id="mcap" style="font-size: 12px;">$${data.market_data.market_cap.usd.toLocaleString()}</div>
            </div>
        </div>`;
        document.getElementById("coin").appendChild(div);
        document.getElementById("searchBar").value = "";
        results.innerHTML = "";
    })
    .catch(error => console.log(error))
}
