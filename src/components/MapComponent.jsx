import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import Graticule from 'ol/layer/Graticule';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';

const MapComponent = () => {
  const mapElement = useRef(null); // Ref for map DOM element
  const mapRef = useRef(null); // Ref for map instance
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0); // State to hold the current WMS layer index

  // List of WMS layers, including your custom `untiled` layer
  const wmsLayers = [
    { 
      name: 'Custom Untiled Layer', 
      url: 'http://localhost:8080/geoserver/example/wms', 
      layer: 'example:output7', 
      format: 'image/png', 
      version: '1.1.1'
    },
  ];

  useEffect(() => {
    // Create base map using OpenStreetMap layer
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    // Create Graticule (Grid) layer
    const graticuleLayer = new Graticule({
      strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)', // Color of grid lines
        width: 1, // Width of grid lines
      }),
      showLabels: true, // Show grid labels
      wrapX: false, // Do not repeat grid lines horizontally
    });

    // Initialize map
    const map = new Map({
      target: mapElement.current, // Target the div element with ref
      layers: [osmLayer, graticuleLayer], // Add base layer and graticule
      view: new View({
        center: fromLonLat([78.9629, 20.5937]), // Center on India
        zoom: 5, // Adjust the zoom level as needed
      }),
      controls: defaultControls(), // Enable default map controls
    });

    // Store the map instance in a ref for further interactions
    mapRef.current = map;

    return () => {
      // Clean up when component unmounts
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    // Function to add WMS layer to the map
    const addWmsLayer = (layerDetails) => {
      // Remove existing WMS layer if any
      mapRef.current.getLayers().forEach(layer => {
        if (layer instanceof ImageLayer) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Add new WMS layer
      const newWmsLayer = new ImageLayer({
        source: new ImageWMS({
          url: layerDetails.url,
          params: {
            LAYERS: layerDetails.layer,
            FORMAT: layerDetails.format || 'image/png',
            VERSION: layerDetails.version || '1.1.1',
            STYLES: '',
            exceptions: 'application/vnd.ogc.se_inimage',
          },
          serverType: 'geoserver',
        }),
      });

      mapRef.current.addLayer(newWmsLayer);
    };

    // Add the current WMS layer when the component mounts or layer index changes
    addWmsLayer(wmsLayers[currentLayerIndex]);

    // Automatically cycle through WMS layers every 2 seconds
    const intervalId = setInterval(() => {
      setCurrentLayerIndex((prevIndex) => (prevIndex + 1) % wmsLayers.length);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [currentLayerIndex]);

  return (
    <div>
      <div
        ref={mapElement}
        style={{
          height: '80vh', // Set height of map container
          width: '100vw', // Full width
          border: '2px solid #000',
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p>Currently displaying: {wmsLayers[currentLayerIndex].name}</p>
      </div>
    </div>
  );
};

export default MapComponent;
