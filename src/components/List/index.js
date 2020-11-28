import React, { useState, useEffect } from 'react';
import { List, Button } from 'semantic-ui-react';
import localForage from 'localforage';

import Results from '../Results';

function ResultList() {
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    localForage.getItem('points').then(data => setItems(data.map(e =>
      <List.Item>
        <List.Content>
          <List.Header>{e.date.toLocaleString('en-GB')}</List.Header>
        </List.Content>
        <List.Content floated='right'>
          <Button icon='eye' onClick={()=> setPoints(e.points)}/>
        </List.Content>
      </List.Item>
    )))
  }, []);

  return(<div>
    <List celled>
      { items }
    </List>
    { points &&
      <Results
      close={() => setPoints(null)}
      points={points}
      maxTilt={20}
      />}
  </div>)
}

export default ResultList
