import * as React from 'react';
import { useState } from 'react';
import MapComponent from './Maps.jsx';
import Table from './Table.jsx';

const App = () => {
  const [oneMarker, setOneMarker] = useState(null);

  return (
    <>
      <MapComponent oneMarker={oneMarker}/>
      <Table setOneMarker={setOneMarker}/>
    </>
  );
};

export default App;
