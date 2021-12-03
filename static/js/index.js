function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: 45.713187, lng: 21.27952 },
    });
  
    setMarkers(map);
}


const beaches = [
    ["Bondi Beach", 45.755312, 21.228491, 4],
    ["Coogee Beach", 45.713187, 21.27952, 5],
    ["Cronulla Beach", -34.028249, 151.157507, 3],
    ["Manly Beach", -33.80010128657071, 151.28747820854187, 2],
    ["Maroubra Beach", -33.950198, 151.259302, 1],
  ];

function setMarkers(map) {
    const image = {
        url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",

        size: new google.maps.Size(20, 32),

        origin: new google.maps.Point(0, 0),

        anchor: new google.maps.Point(0, 32),
    };

    const shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: "poly",
      };

      for (let i = 0; i < beaches.length; i++) {
        const beach = beaches[i];
    
        new google.maps.Marker({
          position: { lat: beach[1], lng: beach[2] },
          map,
          icon: image,
          shape: shape,
          title: beach[0],
          zIndex: beach[3],
        });
      }

    
}