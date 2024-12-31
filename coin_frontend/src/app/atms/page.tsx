'use client';

import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import { useGetAtmsQuery } from '@/api/api';
import { TATMCoordinates } from '@/api/api.types';
import { Container } from '@mui/system';
import { useState } from 'react';
import Image from "next/image";

const containerStyle = {
  width: '100%',
  height: '93vh',
};

const center = {
  lat: 55.7558,
  lng: 37.6173,
};

export default function AtmsMapPage() {
  // const [selectedMarker, setSelectedMarker] = useState<TATMCoordinates | null>(null);
  // const [isGoogleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  // const { data, isSuccess } = useGetAtmsQuery();
  //
  // const handleMarkerClick = (marker: TATMCoordinates) => {
  //   window.open(`https://www.google.com/maps?q=${marker.lat},${marker.lon}`, '_blank');
  //   setSelectedMarker(marker);
  // };

  return (
    <Container maxWidth={'xl'} sx={{
      height: '100vh',
      width: '100%',
      position: 'relative',
      padding: 0,
    }}>
      {/*<LoadScript googleMapsApiKey='xxxx' onLoad={() => setGoogleMapsLoaded(true)}>*/}
      {/*  <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>*/}
      {/*    {isSuccess &&*/}
      {/*      isGoogleMapsLoaded &&*/}
      {/*      data.payload.map((atm: TATMCoordinates, index: number) => (*/}
      {/*        <Marker*/}
      {/*          key={index}*/}
      {/*          position={{ lat: atm.lat, lng: atm.lon }}*/}
      {/*          label={{*/}
      {/*            text: 'COIN',*/}
      {/*            color: 'white',*/}
      {/*            fontSize: '12px',*/}
      {/*            fontWeight: 'bold',*/}
      {/*          }}*/}
      {/*          icon={{ url: '/marker-map.svg', labelOrigin: new window.google.maps.Point(16, 15) }}*/}
      {/*          onClick={() => handleMarkerClick(atm)}*/}
      {/*        />*/}
      {/*      ))}*/}
      {/*    {selectedMarker && (*/}
      {/*      <InfoWindow position={{ lat: selectedMarker.lat, lng: selectedMarker.lon }} onCloseClick={() => setSelectedMarker(null)}>*/}
      {/*        <div>*/}
      {/*          <h3>Point Information</h3>*/}
      {/*          <p>longitude: {selectedMarker.lon}</p>*/}
      {/*          <p>latitude: {selectedMarker.lat}</p>*/}
      {/*        </div>*/}
      {/*      </InfoWindow>*/}
      {/*    )}*/}
      {/*  </GoogleMap>*/}
      {/*</LoadScript>*/}
      <Image
        src='/map.webp'
        alt='map stopper'
        layout='fill'
        objectFit='cover'
      />
    </Container>
  );
}
