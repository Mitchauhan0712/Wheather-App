import "./App.css";
import TopButtons from "./components/TopButtons";
import Inputs from "./components/Inputs";
import TimeAndLocation from "./components/TimeAndLocation";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./Services/weatherService";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [query, setQuery] = useState({ q: "berlin" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q ? query.q : "current location.";

      toast.info("Fetching weather for " + message);

      await getFormattedWeatherData({ ...query, units })
        .then((data) => {
          if (!data) {
            toast.error("Please enter a valid location name.");
          } else {
            toast.success(
              `Successfully fetched weather for ${data.name}, ${data.country}.`
            );
            setWeather(data);
          }
        })
        .catch(() => {
          toast.error("An error occurred while fetching weather data.");
        });
    };

    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };

  return (
    <div className="flex justify-center bg-gradient-to-br  from-cyan-700 via-cyan-400 to-blue-500 items-center h-screen">
      <div
        className={`mx-auto max-w-screen-md mt-4 py-5 rounded-xl px-32 bg-gradient-to-br  h-fit shadow-xl shadow-cyan-400 ${formatBackground()}`}
      >
        <h1 className="text-3xl font-semibold text-center text-white mb-4">
          Weather App
        </h1>
        <TopButtons setQuery={setQuery} />
        <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

        {weather && (
          <div>
            <TimeAndLocation weather={weather} />
            <TemperatureAndDetails weather={weather} />

            {weather.hourly && (
              <Forecast title="hourly forecast" items={weather.hourly} />
            )}
            {weather.daily && (
              <Forecast title="daily forecast" items={weather.daily} />
            )}
          </div>
        )}

        <ToastContainer autoClose={3000} theme="colored" newestOnTop={true} />
      </div>
    </div>
  );
}

export default App;
