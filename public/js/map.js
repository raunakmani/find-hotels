
mapboxgl.accessToken=mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12',
center: JSON.parse(coordinates),  // starting position [lng, lat]
zoom:10.1, // starting zoom
});
console.log(2)
// const marker=  new mapboxgl.Marker()
// .setLngLat(coordinates)// Listing.geomertry.coordinates
// .addTo(map);

 console.log(coordinates);
const marker = new mapboxgl.Marker()
.setLngLat (JSON.parse(coordinates))
.addTo(map);
console.log(marker);