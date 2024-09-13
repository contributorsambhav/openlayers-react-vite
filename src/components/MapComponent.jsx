import { useEffect, useRef, useState } from 'react';
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
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const [currentLayerName, setCurrentLayerName] = useState('');

<<<<<<< HEAD
  // List of WMS layers, including your custom `untiled` layer
=======
>>>>>>> f16278dd108ac2dfdba6309d3ad36e1cfde3ca53
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
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

<<<<<<< HEAD
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
=======
    const map = new Map({
      target: mapElement.current,
      layers: [osmLayer],
>>>>>>> f16278dd108ac2dfdba6309d3ad36e1cfde3ca53
      view: new View({
        center: fromLonLat([78.9629, 20.5937]),
        zoom: 5,
      }),
      controls: defaultControls(),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(null);
    };
  }, []);

  useEffect(() => {
    const showSmoothTransitions = (wmsLayers, transitionDuration) => {
      let currentIndex = 0;
      let nextIndex = 1;
      let currentLayer = null;
      let nextLayer = null;

      const createWmsLayer = (layerDetails, opacity = 1) => {
        return new ImageLayer({
          source: new ImageWMS({
            url: layerDetails.url,
            params: {
              LAYERS: layerDetails.layer,
            },
            serverType: 'geoserver',
          }),
          opacity: opacity,
        });
      };

      const transition = () => {
        if (currentLayer) {
          mapRef.current.removeLayer(currentLayer);
        }

<<<<<<< HEAD
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
=======
        currentLayer = nextLayer;
        nextIndex = (nextIndex + 1) % wmsLayers.length;
        nextLayer = createWmsLayer(wmsLayers[nextIndex], 0);
        mapRef.current.addLayer(nextLayer);
>>>>>>> f16278dd108ac2dfdba6309d3ad36e1cfde3ca53

        setCurrentLayerName(wmsLayers[currentIndex].name);

        let start = null;
        const animate = (timestamp) => {
          if (!start) start = timestamp;
          const progress = (timestamp - start) / transitionDuration;

          if (progress < 1) {
            currentLayer.setOpacity(1 - progress);
            nextLayer.setOpacity(progress);
            requestAnimationFrame(animate);
          } else {
            currentIndex = (currentIndex + 1) % wmsLayers.length;
            setTimeout(transition, 100); // Wait for 2 seconds before next transition
          }
        };

        requestAnimationFrame(animate);
      };

      // Start the transition
      nextLayer = createWmsLayer(wmsLayers[currentIndex]);
      mapRef.current.addLayer(nextLayer);
      transition();
    };

    showSmoothTransitions(wmsLayers, 1000); // 1000ms (1 second) transition duration

<<<<<<< HEAD
    // Automatically cycle through WMS layers every 2 seconds
    const intervalId = setInterval(() => {
      setCurrentLayerIndex((prevIndex) => (prevIndex + 1) % wmsLayers.length);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [currentLayerIndex]);

  return (
    <div>
=======
    // No need for cleanup as the transitions will stop when the component unmounts
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Smooth Transitioning WMS Layers</h1>
>>>>>>> f16278dd108ac2dfdba6309d3ad36e1cfde3ca53
      <div
        ref={mapElement}
        style={{
          height: '80vh',
          width: '100vw',
          border: '2px solid #000',
        }}
      />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p>Currently displaying: {currentLayerName}</p>
      </div>
    </div>
  );
};

export default MapComponent;