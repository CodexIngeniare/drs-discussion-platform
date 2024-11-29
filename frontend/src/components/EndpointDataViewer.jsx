import React, { useState } from 'react';

function EndpointDataViewer(props) {
    const [endpoint, setEndpoint] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setData(null);
        setLoading(true);
        setError(null);
      
        try {
          const response = await fetch(props.baseURL + '/' + endpoint);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    const handleInputChange = (e) => {
      setEndpoint(e.target.value);
    };

    return (
        <div className="EndpointDataViewer">
            <input type='text' value={props.baseURL} readOnly/>
            /
            <input type='text' id='endpoint' onChange={handleInputChange}/>
            <button onClick={fetchData}>Fetch Data</button>
            <div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {data && (
                <pre>
                {JSON.stringify(data, null, 2)}
                </pre>
            )}
            </div>
        </div>
    );
}

export default EndpointDataViewer;
