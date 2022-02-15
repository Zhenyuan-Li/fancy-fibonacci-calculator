import React, { useEffect, useReducer, useRef } from 'react';
import axios from 'axios';

const fibReducer = (state, action) => {
  switch (action.type) {
    case 'SEEN_INDEXES':
      return {
        seenIndex: action.payload,
        values: state.values,
        index: state.index,
      };
    case 'VALUES':
      return {
        seenIndex: state.seenIndex,
        values: action.payload,
        index: state.index,
      };
    case 'INDEX':
      return {
        seenIndex: state.seenIndex,
        values: state.values,
        index: action.payload,
      };
    default:
      return { seenIndex: [], values: {}, index: '' };
  }
};

const Fib = () => {
  const indexRef = useRef();
  const [fibState, dispatchFib] = useReducer(fibReducer, {
    seenIndex: [],
    values: {},
    index: '',
  });

  const fetchValues = async () => {
    const values = await axios.get('/api/values/current');
    dispatchFib({ type: 'VALUES', payload: values.data });
  };

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all');
    dispatchFib({ type: 'SEEN_INDEXES', payload: seenIndexes.data });
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const { seenIndex, values, index } = fibState;

  const submitHandler = async (event) => {
    event.preventDefault();

    await axios.get('/api/values', {
      index: indexRef.current.value,
    });
  };

  const renderValues = () => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Enter your index:</label>
        <input ref={indexRef} value={index} />
        <button>Submit</button>
      </form>
      <h3>Index I seen:</h3>
      {seenIndex.map(({ number }) => number).join(', ')}
      <h3>Calculated Values:</h3>
      {renderValues}
    </div>
  );
};

export default Fib;
