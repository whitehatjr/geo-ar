let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
    // render_map();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
    $.ajax({
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
        type: "get",
        success: function (response) {
            let images = {
                "turn_right": "ar_right.png",
                "turn_left": "ar_left.png",
                "slight_right": "ar_slight_right.png",
                "slight_left": "ar_slight_left.png",
                "straight": "ar_straight.png"
            }
            let steps = response.routes[0].legs[0].steps
            for (let i = 0; i < steps.length; i++) {
                let image;
                let distance = steps[i].distance
                let instruction = steps[i].maneuver.instruction
                if (instruction.includes("Turn right")) {
                    image = "turn_right"
                } else if (instruction.includes("Turn left")) {
                    image = "turn_left"
                }
                if (i > 0) {
                    $("#scene_container").append(
                        `
                            <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                                <a-image 
                                    name="${instruction}"
                                    src="https://github.com/apoorvelous/geo-ar/blob/main/assets/${images[image]}"
                                    look-at="#step_${i - 1}"
                                    scale="5 5 5"
                                    id="step_${i}"
                                >
                                </a-image>
                                <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                            </a-entity>
                        `
                    )
                } else {
                    $("#scene_container").append(
                        `
                            <a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};">
                                <a-image 
                                    name="${instruction}"
                                    src="https://github.com/apoorvelous/geo-    ar/blob/main/assets/ar_start.png"
                                    look-at="#step_${i + 1}"
                                    scale="5 5 5"
                                    id="step_${i}"
                                >
                                </a-image>
                                <a-text height="50" value="${instruction} (${distance}m)"></a-text>
                            </a-entity>
                        `
                    )
                }
            }
        }
    })
}

// function render_map() {
//     mapboxgl.accessToken = 'pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA';
//     var map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mapbox/streets-v11',
//         center: [coordinates.source_lon, coordinates.source_lat],
//         zoom: 16
//     });

//     var directions = new MapboxDirections({
//         accessToken: mapboxgl.accessToken
//     });

//     map.addControl(directions, 'top-left');

//     map.on('load', function () {
//         directions.setOrigin([coordinates.source_lon, coordinates.source_lat]);
//         directions.setDestination([coordinates.destination_lon, coordinates.destination_lat]);
//         $(".directions-control-inputs").css("display", "none");
//     })

//     map.addControl(
//         new mapboxgl.GeolocateControl({
//             positionOptions: {
//                 enableHighAccuracy: true
//             },
//             trackUserLocation: true
//         })
//     );

//     setTimeout(function () {
//         $(".directions-control-instructions").css("position", "absolute");
//         $(".directions-control-instructions").css("left", "120%");
//         $(".mapbox-directions-instructions-wrapper").css("max-height", "40vh");
//         $(".mapboxgl-ctrl-icon").click()
//     }, 3000)
// }
