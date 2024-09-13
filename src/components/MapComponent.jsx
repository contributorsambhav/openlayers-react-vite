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

const MapComponent = () => {
  const mapElement = useRef(null); // Ref for map DOM element
  const mapRef = useRef(null); // Ref for map instance
  const wmsLayerRef = useRef(null); // Ref to hold the WMS layer instance

  const [currentLayerIndex, setCurrentLayerIndex] = useState(0); // State to hold the current WMS layer index
  const [opacity, setOpacity] = useState(0.6); // State to hold the opacity of the current WMS layer

  // List of WMS layers, including your custom `untiled` layer
  const wmsLayers = [
    { 
      name: 'Custom Untiled Layer', 
      url: 'http://localhost:8080/geoserver/example/wms', 
      layer: 'example:output8', 
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

    // Function to add WMS layer to the map
    const addWmsLayer = (layerDetails) => {
      // Create and store the WMS layer with initial opacity
      const wmsLayer = new ImageLayer({
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
        opacity: opacity, // Set the initial opacity
      });

      wmsLayerRef.current = wmsLayer; // Store the WMS layer in a ref
      map.addLayer(wmsLayer); // Add the WMS layer to the map
    };

    // Add the current WMS layer when the component mounts
    addWmsLayer(wmsLayers[currentLayerIndex]);

    return () => {
      // Clean up when component unmounts
      map.setTarget(null);
    };
  }, [currentLayerIndex]);

  // Handle opacity changes without re-adding the layer
  useEffect(() => {
    if (wmsLayerRef.current) {
      wmsLayerRef.current.setOpacity(opacity); // Update opacity directly
    }
  }, [opacity]);

  // Function to handle opacity changes from the slider
  const handleOpacityChange = (event) => {
    const newOpacity = parseFloat(event.target.value);
    setOpacity(newOpacity); // Update the opacity state
  };

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
      
      {/* Opacity slider */}
      <div style={{ position: 'absolute', bottom: '10px', right: '20px', textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
        <label htmlFor="opacitySlider">Layer Opacity: {opacity.toFixed(2)}</label>
        <input
          id="opacitySlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={opacity}
          onChange={handleOpacityChange}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </div>
  );
};

export default MapComponent;
