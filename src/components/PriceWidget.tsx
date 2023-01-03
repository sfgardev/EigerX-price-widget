import React, { useEffect, useState } from "react";

type Currency = {
  asset: "BTC" | "ETH";
  price: number;
};

type SuccessResponse = {
  status: 0;
  result: Currency[];
};

type FailureResponse = {
  status: 1;
  result: string;
};

type ResponseType = SuccessResponse | FailureResponse;

const TIMER_DELAY = 3000;

const PriceWidget = () => {
  const [data, setData] = useState<ResponseType>();
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isThrowError, setisThrowError] = useState(false);

  const fetchData = async (throwError?: boolean) => {
    try {
      if (throwError) {
        return setData({ status: 1, result: "Prices are not available" });
      }

      const response = await fetch("mockData.json");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (isAutoRefresh) {
      timerId = setInterval(() => {
        fetchData(isThrowError);
      }, TIMER_DELAY);
    }

    return () => clearInterval(timerId);
  }, [isAutoRefresh, isThrowError]);

  const refreshClickHandler = () => {
    fetchData(isThrowError);
  };

  return (
    <>
      {isInitialLoad && (
        <p className="nodata-text">No data. Press the Refresh button</p>
      )}

      {!isInitialLoad && data?.status === 0 && (
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data?.result.map((item) => (
              <tr key={item.asset}>
                <td>{item.asset}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data?.status === 1 && <p>{data.result}</p>}

      <div className="widget-actions">
        <button onClick={refreshClickHandler}>Refresh</button>
        <input
          id="refresh-behavior"
          type="checkbox"
          checked={isAutoRefresh}
          onChange={(e) => setIsAutoRefresh(e.target.checked)}
        />
        <label htmlFor="refresh-behavior">Auto-refresh</label>
        <input
          id="error-behavior"
          type="checkbox"
          checked={isThrowError}
          onChange={(e) => setisThrowError(e.target.checked)}
        />
        <label htmlFor="error-behavior">Throw error</label>
      </div>
    </>
  );
};

export default PriceWidget;
