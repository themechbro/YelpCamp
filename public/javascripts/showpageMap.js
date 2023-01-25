
mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbWVjaGJybyIsImEiOiJjbGQzMjRqdGIwMWM1M25xbWNnc2RrOHZiIn0.6_UjWm_wrQy3iBsGGp52Kg';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
   new mapboxgl.Popup({offset:25})
       .setHTML(`<h5>${campground.title}</h5>`)
)
.addTo(map)
