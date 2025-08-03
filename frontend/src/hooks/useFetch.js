import { useState, useEffect, useCallback } from "react";

// Simple useFetch hook for GET requests
const useFetch = (url, options = {}) => {
  const {
    method = "GET",
    body,
    headers = {},
    manual = method !== "GET",
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (fetchUrl, fetchOptions = {}) => {
      const finalUrl = fetchUrl || url;
      if (!finalUrl) return;

      setIsLoading(true);
      setError(null);

      try {
        const config = {
          method: fetchOptions.method || method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
            ...fetchOptions.headers,
          },
        };
        // Add body for non-GET requests
        const requestBody = fetchOptions.body || body;
        if (requestBody && config.method !== "GET") {
          config.body = JSON.stringify(requestBody);
        }
        const response = await fetch(finalUrl, config);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Something went wrong");
        }

        setData(result);
        onSuccess?.(result);

        return result;
      } catch (err) {
        const errorMessage = err.message || "Something went wrong";
        setError(errorMessage);

        onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [url, onSuccess, onError, body, method, headers]
  );

  const execute = useCallback(
    (executeUrl, executeOptions = {}) => {
      return fetchData(executeUrl, executeOptions);
    },
    [fetchData]
  );

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [url, manual]);

  return {
    data,
    isLoading,
    error,
    refetch,
    execute,
  };
};

export default useFetch;
