function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 11,
      center: { lat: 45.713187, lng: 21.27952 },
    });
  
    setMarkers(map);
}


const containers = [
    ["punct1", 45.755312, 21.228491, "mm_20_green.png"],
    ["punct2", 45.713187, 21.27952, "mm_20_brown.png"],
  ];

function setMarkers(map) {

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
    
        new google.maps.Marker({
          position: { lat: container[1], lng: container[2] },
          map,
          icon: {                             
            url: "http://labs.google.com/ridefinder/images/" +  container[3]
          },
          title: container[0],
        });
      }

    
}