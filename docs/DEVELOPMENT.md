# Development documentation

##Using Google Maps with React

We can access maps objects by using onGoogleApiLoaded, in this case we will need to set yesIWantToUseGoogleMapApiInternals to true

Example: https://github.com/google-map-react/google-map-react-examples/blob/master/src/examples/Main.js#L69

### Paths
To add a polyline (path):
https://developers.google.com/maps/documentation/javascript/reference/polygon

Eg.
```
  const path = maps.Polyline({
      path: [ { "lat": 53.480759, "lng": -2.242631 },{ "lat": 51.507351, "lng": -0.127758 },{ "lat": 55.953252, "lng": -3.188267 } ],
      geodesic: true,
      strokeColor: '#33BD4E',
      strokeOpacity: 1,
      strokeWeight: 5
    });
    path.setMap(google.map)
```
### Directions
Docs: https://developers.google.com/maps/documentation/javascript/directions
```
options:

{
  origin: LatLng | String | google.maps.Place,
  destination: LatLng | String | google.maps.Place,
  travelMode: 'BICYCLING',
  transitOptions: TransitOptions,
  unitSystem: UnitSystem,
  waypoints[]: DirectionsWaypoint,
  optimizeWaypoints: Boolean,
  provideRouteAlternatives: Boolean,
  avoidFerries: Boolean,
  avoidHighways: Boolean,
  avoidTolls: Boolean,
  region: String
}
```
E.g.

```
let directionsService = new google.maps.DirectionsService()
    var directionsDisplay = new google.maps.DirectionsRenderer()
    directionsDisplay.setMap(google.map)
    
    directionsService.route(
      {
        travelMode: 'BICYCLING',
        origin: "austin, texas",
        destination: "houston, texas"
      },
      (DirectionsResult, DirectionsStatus) => {
        console.log('DirectionsResult', DirectionsResult)
        console.log('DirectionsStatus', DirectionsStatus)
        if (status == 'OK') {
          directionsDisplay.setDirections(DirectionsResult);
        }
      }
    )
```
