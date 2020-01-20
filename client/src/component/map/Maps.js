import './Maps.css';
import React from 'react';
import axios from "axios";
import Slider from "../slider/Slider";
import { Map, GoogleApiWrapper, Marker} from 'google-maps-react';
import trainIcon from "../../icons/icons8-train-50.png"
 
class Maps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      map:[],
      marker:[], 
      trainMarkers:[],
      isInfoWindowOpen:false,
      currentInfoWindow:[null],
      crimeNews:[] || 'Loading...',
      crimeData: this.props.crimeData,
      trainData: this.props.trainStationData,
      trainIcon: {
        url:trainIcon,
        scaledSize: new this.props.google.maps.Size(30, 30), 
      },
      clickedTrainBtn: false,
      openInfoWindow : (map,marker,googleObj) =>{
        console.log("MAP ", map)
        console.log("MARKER ", marker)
        console.log("GOOGLE OBJ ", googleObj)
        return 0;
      },
      onMouseOver:(map,marker) => {
        if(this.isInfoWindowOpen === true){
        this.state.currentInfoWindow[0].close()
        this.isInfoWindowOpen = false;
      }else{
        this.state.currentInfoWindow =[];
        
        let content = map.content;
        let googleObj = this.props.google.maps;
        let infoWindow = new googleObj.InfoWindow({
          content:content
        });
        this.state.currentInfoWindow.push(infoWindow);
        this.isInfoWindowOpen = true;
        infoWindow.open(map,marker);
        }
      },
      onMouseOff:() => {
        let infoWindow = this.state.currentInfoWindow[0];
        this.isInfoWindowOpen = false;
        if (!this.isInfoWindowOpen && infoWindow){
          infoWindow.close()
          
        }
        
      }
    }
    this.handleTrainBtnClick = this.handleTrainBtnClick.bind(this)
    this.handleTrainsNearby = this.handleTrainsNearby.bind(this)
  }
 
  markerIcon = {
    url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFiVpCGq6a1uRuvpBvmybCdTrbu-LzbRQyLMF7JR_JUudoEb8FQ&s",
    scaledSize: new this.props.google.maps.Size(40, 40)
  }

  async componentDidMount () {
    const crimeNews = await axios.get("/scrapeNews");
        this.setState({
            crimeNews : crimeNews.data
        });   
  }

  setsRoute = (mapProps, map) => {
    let lat = this.props.destination.latitude;
    let lng = this.props.destination.longitude;
    let usrLocation = this.props.usrCurrentLocation;
    
    // set the state to retain the instance of the map we have rendered.
    if(map !== undefined){
      this.setState({map:map})
    }
    let mapObj = this.state.map;
    if(this.props.destination.length !== 0){
      this.calcRoutes(mapObj,usrLocation,lat,lng);
      console.log("We have an address", lat,lng);
    }  
  }

  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

 handleTrainsNearby(e) {
  //  console.log(this.distance())
  //  Get the users location and the nearest trains location and output the result.

  console.log("user location => ", this.props.usrCurrentLocation )
  console.log("train location location => ",e )

 } 

 trainInfoWindow (map, trainMarker){
   console.log("Info window is active!");
  //  let infoWindow = new googleObj.InfoWindow({
  //   content:content
  // });
  // this.state.currentInfoWindow.push(infoWindow);
  // this.isInfoWindowOpen = true;
  // infoWindow.open(map,trainMarker);
  // }
   
 }

 handleTrainBtnClick () {
  // console.log("Map => ", this.state.map);
  let stationLocations = this.props.trainStationData;
  let map = this.state.map;
  let markersArr = [];
  let infoWindow = this.trainInfoWindow;
  
if (this.state.clickedTrainBtn === false){
  this.state.clickedTrainBtn = true
  stationLocations.map((stationCoords) => {
    let latitude = parseFloat(stationCoords.latitude);
    let longitude = parseFloat(stationCoords.longitude);
    let position = {lat:latitude,lng:longitude};
    let lines = stationCoords.line;
    let info = stationCoords.info;
    let name = stationCoords.station;
    
    let marker = new this.props.google.maps.Marker({
      position:position,
      title:name,
      content:info,
      lines:lines,
      icon:this.state.trainIcon,
      onClick:{infoWindow},
    });
    markersArr.push(marker)
    marker.setMap(map)
  })
  this.setState({trainMarkers:markersArr})
  

 } else if (this.state.clickedTrainBtn === true) {
   
   this.state.clickedTrainBtn = false;
  for(let i = 0; i<this.state.trainMarkers.length; i++){
    this.state.trainMarkers[i].setMap(null);
  }
   
    
    
   
 }

}
  
  polyLineClosure = (polylineOptions,map) => {
    let safePath;
    safePath = new this.props.google.maps.Polyline(polylineOptions[0]);
    safePath.setMap(map);
  }

  calcRoutes = (map,usrLocale,lat,lng) => {
    let polylineOptions = [];
    let directionsService = new this.props.google.maps.DirectionsService();
    let start = usrLocale;
    let end = new this.props.google.maps.LatLng(lat,lng);
    let request = {
      origin:start,
      destination: end,
      optimizeWaypoints:true,
      travelMode: 'WALKING',
      provideRouteAlternatives:true
    };
    directionsService.route(request, (res, status) => {
      let points = []
      if (status === 'OK'){
        points = res.routes[0].overview_path;
        polylineOptions.push( {
          path: points,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map:map
        })
    } else {
        console.log("error ", status)
    }
    this.polyLineClosure(polylineOptions,map)
    });
  }

  onMouseover = (props, marker, e) => {
  // console.log("mouse over ", props, marker, e);
  marker.addListener('click', function(){
    console.log("MOUSE OVER WORKS",props);
    console.log(e.target);
  });
  }

  render(){
    const openInfoWindow = this.state.onMouseOver;
    const offIcon = this.state.onMouseOff

    // This variable holds the crime icon, sized for the map when rendered.
    const crimeIcon = {
    url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXL8dMbULRMR3YVcdoZKDvHAKDEnyRIqnPx-llmYVULI5oTCTd&s",
    scaledSize: new this.props.google.maps.Size(40, 40)
    }
    const crimeMarkers = this.props.coor.map(function(item){
    const validateCrimeLevel = (crimeLevel) => {
      switch(crimeLevel){
        case "F":
          return "Felony";
          case "M":
          return "Misdemeanor";
          case "V":
          return "Violation";
      }
    }
      return(
        <Marker 
        title={'CrimeLocale'}
        position={{lat: item.lat, lng: item.lng}}
        icon={crimeIcon}
        content={
          '<div id="content">'+
            '<ul style="list-style-type:none;">'+
              '<li>'+ "Crime: " + item.crime +'</li>'+
              '<li>'+ "Date: " + item.date +'</li>'+
              '<li>'+ "Race: " + item.race +'</li>'+
              '<li>'+ "Crime Level: " + validateCrimeLevel(item.levelOfOffense) +'</li>'+
              '<li>'+ "Sex: " + item.sex +'</li>'+
            '</ul>'+
          '</div>'
        }
        // onMouseover={hover}
        onMouseout= {offIcon}
        onClick={openInfoWindow}
        >
        </Marker>
      );
    });
    return(
      <div>   
        <Map
          className="google-map"
          google={this.props.google}
          zoom={11}
          disableDefaultUI= {true}
          styles={[
            {
              "featureType": "road.arterial",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#7cff78"
                },
                {
                  "weight": 2
                }
              ]
            }
          ]}
          initialCenter={{lat: 40.7128, lng: -74.0060}}
          onReady={this.setsRoute}
          >
          {this.setsRoute()}
          {crimeMarkers}
          {this.setDestinationMarker}
          <Marker
            position={this.props.usrLocale}
            icon={this.markerIcon}
            onMouseover={this.onMouseover}
          />
          <button
            id="train-Button" 
            onClick={this.handleTrainBtnClick}
            >TrainBtn
          </button>
          <button id="trains-nearby"
            onClick={this.handleTrainsNearby}>
            Trains Near by
          </button>
          <Slider 
            className="slider" 
            crimeNews={this.state.crimeNews} />
             
        </Map>
       
        
      </div>
    );
  };
};
export default GoogleApiWrapper({
apiKey:process.env.REACT_APP_APIKEY
})(Maps);