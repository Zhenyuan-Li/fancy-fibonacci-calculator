import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

const Fib = () => {
  const indexRef = useRef();
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});

  const fetchValues = useCallback(async () => {
    const values = await axios.get('/api/values/current');
    setValues(values.data);
  }, []);

  const fetchIndexes = useCallback(async () => {
    const seenIndexes = await axios.get('/api/values/all');
    setSeenIndexes(seenIndexes.data);
  }, []);

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, [fetchValues, fetchIndexes]);

  useEffect(() => {}, [values, seenIndexes]);

  const submitHandler = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: indexRef.current.value,
    });
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      if (values[key] === 'Nothing yet!') {
        continue;
      } else {
        entries.push(
          <div key={key}>
            For index {key} I calculated {values[key]}
          </div>
        );
      }
    }
    return entries;
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Enter your index:</label>
        <input ref={indexRef} />
        <button>Submit</button>
      </form>
      <h3>Index I seen:</h3>
      {seenIndexes.map(({ number }) => number).join(', ')}
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
