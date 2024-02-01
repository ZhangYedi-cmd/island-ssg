import React, {useState} from 'react';

export const Content = () => {
  const [count, setCount] = useState<number>(0)
  return <>
    <h2>{count}</h2>
    <button onClick={() => setCount(count + 1)}>button + 1</button>
  </>;
};
