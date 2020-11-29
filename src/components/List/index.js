import React, { useState, useEffect } from 'react';
import { List, Button } from 'semantic-ui-react';
import localForage from 'localforage';

import Results from '../Results';

function ResultList() {
  const [points, setPoints] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if ( results.length <= 0 ) localForage.getItem('points').then(data => setResults(data));
    localForage.setItem('points', results);
  });

  return(<div>
    <List celled>
    { results.length <= 0 && <div> No results saved </div> }
    { results && results.map((e, i, arr) =>
        <List.Item>
          <List.Content>
            <List.Header>{e.date.toLocaleString('en-GB')}</List.Header>
          </List.Content>
          <List.Content floated='right'>
            <Button icon='trash' onClick={()=> setResults(arr.filter(innerE => e !== innerE))}/>
            <Button icon='eye' onClick={()=> setPoints(e.points)}/>
          </List.Content>
        </List.Item>
      )

    }
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
