let div  = document.getElementById("map");
var currentLat = 45.713187;
var currentLong = 21.27952;
var counter = 0;


function initMap() {
    getLocation(div);
    let containerMap = JsonParser();
    var delayInMilliseconds = 1000; //1 second

    setTimeout(function() {
        makeMap(containerMap);
    }, delayInMilliseconds);
}

function makeMap(containerMap) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: { lat: currentLat, lng: currentLong },
    });

    setMarkers(map, containerMap);
}


const containers = [
    ["punct1", 45.755312, 21.228491, "mm_20_green.png"],
    ["punct2", 45.713187, 21.27952, "mm_20_brown.png"],
  ];



function setMarkers(map, containerMap) {

    const windows = [];
    console.log("abbc");
    for (const cont in containerMap) {
        console.log(containerMap[cont][1]);
        const marker = new google.maps.Marker({
            position: { lat: containerMap[cont][1], lng: containerMap[cont][0] },
            map,
            icon: {
                url: "http://labs.google.com/ridefinder/images/" +  "mm_20_green.png"
            },
            title: containerMap[cont][3],
            });
        console.log(marker);
        windows.push(marker);
    }

    /*
    for (let i = 0; i < counter; i++) {
        const container = containerMap[i];

        console.log("abbc");

        const marker = new google.maps.Marker({
            position: { lat: container[0], lng: container[1] },
            map,
            icon: {
                url: "http://labs.google.com/ridefinder/images/" +  "mm_20_green.png"
            },
            title: container[3],
            });
        windows.push(marker);
    }*/

    for(let i=0;i<windows.length;i++)
      {
          const point = windows[i];

          const infowindow = new google.maps.InfoWindow({
            content: point.title,
          });

          point.addListener("click", () => {

            infowindow.open({
              anchor: point,
              map,
              shouldFocus: false,
            });

            document.getElementById("emptyContainerPres").innerHTML = point.title + " is empty: "
            document.getElementById("emptyContainer").innerHTML = point.title

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

    currentLat = CurrentPosX;
    currentLong = CurrentPosY;

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

    counter = 0;
    for(var item in parsedJson){
         let containerTipAndId = parsedJson[item].tip_colectare +'_id'+ parsedJson[item].id;
         let longitudine = parsedJson[item].longitudine;
         let latitudine = parsedJson[item].latitudine;
         let tip = parsedJson[item].tip_colectare;
         let adresa = parsedJson[item].adresa;
         let companie = parsedJson[item].companie;
         let website = parsedJson[item].website;
         containerList[containerTipAndId] = [longitudine, latitudine, tip, adresa, companie, website];
         counter ++;
    }

    return containerList;
}