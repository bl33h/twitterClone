import React, { useEffect, useState } from 'react';

function App() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPeople(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Node Data</h1>
      {people.length > 0 ? (
        <ul>
          {people.map((person, index) => (
            <li key={index}>
              {person.properties.name}, Age: {person.properties.age}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
}

export default App;