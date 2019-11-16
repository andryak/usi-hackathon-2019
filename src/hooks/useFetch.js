import { useEffect, useState } from 'react';
import getData from '../data/getData';

export default (url, options) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getData(url, options);
        const json = typeof(res)==='object'? res: await res.json();
        setResponse(json);
        setIsLoading(false)
      } catch (error) {
        setError(error);
      }
    };
    fetchData().catch(e=>new Error(`Error Fetching: ${e}`));
  }, [options, url]);
  return { response, error, isLoading };
};
