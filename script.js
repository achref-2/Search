
let map;
const init_center = { lat: 51.1666, lng: 10.45 };

function initMap() {
    map = new google.maps.Map(document.getElementById("mapContainer"),
        { center: init_center, zoom: 7, disableDefaultUI: true, });
    bounds = new google.maps.LatLngBounds();
}
window.initMap = initMap;


let markers = [];


const fetchCountries = async () => {
    const url = 'https://booking-com15.p.rapidapi.com/api/v1/meta/getLanguages';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'API KEY',
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result.data);
    } catch (error) {
        console.error(error);
    }
}



const submit = document.querySelector("#submit");
submit.setAttribute('disabled', '');
const fetchHotels=async() => {
        const url = 'https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=man';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'API KEY',
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
    }
} 
fetchHotels();
API='API KEY';
/*
async function getMarkers(country) {
    API='2f24ab8f79msh9947d3c74067c97p11ef2djsnd4b048614de1';

    const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${country}}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API,
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options)
    const result = await response.json()

    markers = []

    result.sr.map(pos => {
        const lat = parseFloat(pos.coordinates.lat)
        const lng = parseFloat(pos.coordinates.long)
        const position = { lat, lng }
        markers.push(position)
        bounds.extend(new google.maps.LatLng(position))
    })

    submit.removeAttribute('disabled', '');

}

*/

(async function load_language() {

    const result = await fetchCountries()
    const countruesLists = document.querySelector('#countries_list')
    


    for (let i = 0; i < result.data.length; i++) {
        const e = result[i];
        languages_list.innerHTML += `
            <li data-value="${e.name}" data-sprache="${e.code}">
                <span>${e.name}</span>
            </li>`
    }

    languages_list.style.display = "none";
    
    languages_input.addEventListener('click', () => {
        languages_list.style.display = "block";
    })

    let sprachen_options = Array.from(document.querySelectorAll("#languages_list li"));

    sprachen_options.map((option) => {
        option.addEventListener('click', (e) => {
            languages_input.value = option.dataset.value
            languages_list.style.display = "none";
            getMarkers(option.dataset.value)
        })
    });

})()



const search_input = document.getElementById('search');

search_input.addEventListener('input', async function (e) {

    auto_suggest_list.innerHTML = '';
    const result = await fetchCountries()


    result.data.map(country => {
        country_lower = country.name.toLowerCase()

        if (e.target.value && e.target.value !== '' && country_lower.startsWith(e.target.value)) {
            auto_suggest_list.innerHTML += `
                <ul class="auto_suggest_list">
                    <li data-country="${country.name}">
                        <span>${country.name}</span>
                    </li>
                </ul>`;
        }
    })


    const auto_suggest_select = Array.from(document.querySelectorAll('#auto_suggest_list li'));

    auto_suggest_select.map(selected => {
        selected.addEventListener('click', function () {
            getMarkers(this.dataset.country)
            e.target.value = this.dataset.country
            auto_suggest_list.style.display = "none"
        })
    })


})





const input_search_form = document.querySelector("#input_search");

input_search_form.addEventListener("submit", function (e) {
    e.preventDefault();

    markers.map((marker) => {
        console.log(marker)
        new google.maps.Marker({ position: marker, map })
    })
    map.fitBounds(bounds);
    markers = []
});
