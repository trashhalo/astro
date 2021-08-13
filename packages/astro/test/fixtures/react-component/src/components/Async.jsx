import React, {useState} from 'react';

function Inner({value}) {
    return (<h1 id="async-h1">{value}</h1>)
}

function Async() {
  const fetchThing = () => {
      throw Promise.resolve('hello');
  };
  const [value] = useState(fetchThing);
  return (<Inner value={value}></Inner>);
}

export default Async
