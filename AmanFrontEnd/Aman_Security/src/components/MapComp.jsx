import React, { useEffect, useRef, useState } from 'react';
//open layer imports
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay.js';
import Pointer from 'ol/interaction/Pointer';
import { Icon, Style } from 'ol/style';
import 'ol/ol.css';
//socket io
import socketIoClient from 'socket.io-client';



async function getData(url,setHouses){
  try {
    const response = await fetch(url);
    const results = await response.json();
    setHouses(results.houses);
    
  } catch (error) {
     return(error)
  }

}

//map component
function MapComp() {

  //list to store houses from db and real-time
  const [houses , setHouses] = useState([]);
  const [userLocation , setUserLocation] = useState([ 31.63258,30.17567]);


  const mapRef = useRef(null);
  const olMapRef = useRef(null);
  

  //fetch data and creates a map
  useEffect(() => {

    getData('http://localhost:3001/police/track',setHouses)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude])
        console.log("that's the real loc")
      },(error) => {
        console.error('Error getting location:', error);
      }
    )
    }
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource(),
        }),
      ],
      view: new View({
        center: fromLonLat(userLocation),
        zoom: 10,
      },
    )
    });

    olMapRef.current = map;
    return () => map.setTarget(null);
  }, []);

  //display houses on a vector layer
  useEffect(() => {
    const map = olMapRef.current;
  
    for (const house of houses) {
      // Set properties to the house object (optional, for clarity)
      const { longitude, latitude, house_id, user_id, address } = house;
  
      // Convert coordinates
      const houseCord = fromLonLat([longitude, latitude]);
  
      // Create the feature
      const pointFeature = new Feature({
        geometry: new Point(houseCord),
      });
  
      // Set the feature properties
      pointFeature.setProperties({
        house_id,
        user_id,
        address,
        longitude,
        latitude,
      });
  
      // Apply a style to the feature
      pointFeature.setStyle(
        new Style({
          image: new Icon({
            src: "/HouseGreen.png",
            className: 'ol-house-icon',
            scale: 0.12,
          }),
        })
      );
  
      // Add the feature to the vector layer
      const vectorSource = map.getLayers().getArray()[1].getSource();
      vectorSource.addFeature(pointFeature);
    }
    // change mouse cursor when over icon
      map.on('pointermove',(e) => {
        const hit = map.hasFeatureAtPixel(e.pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
      });
  }, [houses]);
  
 //realtime data handling 
  useEffect(()=>{
    console.log('useEffect for WebSocket connection ran');
    const socket = socketIoClient('ws://localhost:3001/police/track', {
      transports: ['websocket'],
    });
  
    socket.on('connect', () => {
      console.log('WebSocket client connected');
    });

    // Log connection errors if any
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for the 'houseAdded' event
    socket.on('houseAdded', (newHouse) => {
      setHouses((prevHouses) => [...prevHouses, newHouse]);
    });

    // Handle sensor trigger event (Intruder detected)
    socket.on('sensorTriggered', (house) => {
      console.log(house.house_id)
      const map = olMapRef.current;
      const vectorSource = map.getLayers().getArray()[1].getSource();
      
      // Find the feature with the matching house_id
      const feature = vectorSource.getFeatures().find(
        (feature) => feature.get('house_id') === house.house_id
      );

      if (feature) {
        feature.setStyle(
          new Style({
            image: new Icon({
              src: '/HouseRed.png',
              scale: 0.12,
             }),
           })
         )
        }
      }
  )

    return () => {
      socket.disconnect();
    };

  }, [])

  //pop up test
  useEffect(()=>{
    const map = olMapRef.current

    const popUpElement = document.createElement('div');
    popUpElement.className = "font-medium p-2 text-[#EEF5F4] rounded-xl w-[200px] bg-[#303030]";

    const popUp = new Overlay({
      element: popUpElement,
      positioning: 'top-center',
      stopEvent: false,
    })
    
    map.addOverlay(popUp);


    map.on('click', (event) => {

      const coordinate = event.coordinate;
      
      // Check if the click is over a house feature (based on coordinates)
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        map.getInteractions().forEach((interaction) => {
          if (interaction instanceof Pointer) {
            interaction.setActive(false);
          }
        });
        const houseDetails = feature.getProperties();
        popUpElement.innerHTML = `
          <div>
            <h4>House ID: ${houseDetails.house_id}</h4>
            <h4>UserID: ${houseDetails.user_id}</h4>
            <p>Address: ${houseDetails.address}</p>
          </div>
        `;
        
        popUp.setPosition(coordinate);


      } 
      else {
          map.getInteractions().forEach((interaction) => {interaction.setActive(true);});
          popUp.setPosition(undefined);
     
      }
      
    }
  )
    

  })

  function sidebar(){
    document.getElementById("sidebar").classList.remove("hidden")
    
  }

  return (
    <>
      <button onClick={sidebar} className='flex justify-center size-9.5 p-0 m-0 fixed  left-[94%] top-11 hover:bg-[#383b41] transition delay-10 duration-200 ease-in-out rounded-xl'>
        <img className='m-auto size-7.5' src="./pane3.png" alt="" />
      </button>
      <div className="flex flex-col m-auto mt-5">
         <img className= "w-[250px]" src="./logo.png" alt="" />
         <h1 className="flex text-xl font-mono font-semibold text-[#bf8dda] justify-center mt-[5px]">SECURITY SYSTEM</h1>
      </div>


      <div
        className="flex justify-center items-center w-[95%] mx-auto h-[700px] mt-7 rounded-3xl"
        ref={mapRef}
      >
      </div>

      <button 
      className=' font-semibold text-amber-50 my-[20px] self-center w-[130px] h-[25px] rounded-xl  bg-[#A052CA] hover:bg-[#A052CA] hover:w-[150px] hover:h-[30px] hover:rounded-2xl transition-all'>Take action
      </button>
      </>
  );
}

export default MapComp;
