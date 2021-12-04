let div  = document.getElementById("map");

function initMap() {
    getLocation(div)
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

function calculateDistance( ContainerPosX, ContainerPosY, CurrentPosX1,  CurrentPosY1){
    let a = ((ContainerPosX-CurrentPosX1)*(ContainerPosX-CurrentPosX1) + (ContainerPosY-CurrentPosY1)*(ContainerPosY-CurrentPosY1))*(1/2);
    return a;

}

function getLocation(div) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(FindClosestContainer);
    } else {
        div.innerHTML = "The Browser does not support GeoLocation";
    }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function FindClosestContainer(position) {

    let CurrentPosX = position.coords.latitude;
    let CurrentPosY = position.coords.longitude;

    let containerListOfCoord = JsonParser();

    //----------------------------
    let NameOfContainerAndDistance = [];
    for (const Container in containerListOfCoord) {
        NameOfContainerAndDistance.push({
            key:   Container,
            value: calculateDistance(containerListOfCoord[Container][0] ,  containerListOfCoord[Container][1] , CurrentPosX ,CurrentPosY),
        });
    }

    let HoldValues = [];
    let newDic = {};
    for(let i = 0; i < NameOfContainerAndDistance.length; i++)
    {
        HoldValues.push(Object.values(NameOfContainerAndDistance[i])[1]);
        newDic[Object.values(NameOfContainerAndDistance[i])[0]] = Object.values(NameOfContainerAndDistance[i])[1];
    }

    let closestContainer = Math.min.apply(Math,HoldValues); //distance from user position to closest container

    console.log(containerListOfCoord[getKeyByValue(newDic , closestContainer)][0]) ; //Name of that container
    console.log(containerListOfCoord[getKeyByValue(newDic , closestContainer)][1]) ;
}

//Here is the Json parser algorithm for aquiring the data for containerListOfCoord
//----------------------------
function JsonParser() {
    let JsonData = json_data.toString()

    JsonData = JsonData.replace('"[', '[');
    JsonData = JsonData.replace(']"', ']');
    let parsedJson = JSON.parse(JsonData);

    let containerList = {
    // ------------Here add the names and coordonates--------------
    };

    for(var item in parsedJson){
         let containerTipAndId = parsedJson[item].tip_colectare +'_id'+ parsedJson[item].id;
         let longitudine = parsedJson[item].longitudine;
         let latitudine = parsedJson[item].latitudine;
         containerList[containerTipAndId] = [longitudine,latitudine];
    }

    console.log(containerList);

    return containerList;
}