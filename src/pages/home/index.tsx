import { useEffect, useState } from "react";
import TrainStatusTable from "../../components/trainStatusTable";
import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import AllTrainsToday from "../../components/allTrains";





export default function Home() {
  const [trainNumber, setTrainNumber] = useState<string>('');
  const [trainDetails, setTrainDetails] = useState<TrainDetails>()
  const [allTrains, setAllTrains] = useState<Map<string, TrainDetails>>(new Map<string, TrainDetails>())
  const [alertMsg, setAlertMsg] = useState<string>('')
  const [errExists, setErrExists] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch(`https://api-v3.amtraker.com/v3/trains`);
        const data: Record<string, TrainDetails[]> = await response.json();
        const filteredMap = new Map<string, TrainDetails>();

        for (const [key, trains] of Object.entries(data)) {
          if (trains.length > 0) {
            filteredMap.set(key, trains[0]);
          }
        }

        setAllTrains(filteredMap);
      } catch (error) {
        setErrExists(true);
        const msg = `Failed to fetch data for train ${trainNumber}: ${error}`;
        setAlertMsg(msg);
        console.error(msg);
      } finally {
      setLoading(false); 
    }
    };

    fetchTrains();
  }, []);

  const handleSubmitTrainNum = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trainNumber) {
      return
    }

    setTrainDetails(allTrains.get(trainNumber));
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="center-container">
          <h1 className="flip-title title-row">
            <SplitFlap value={"TRACK YOUR TRAIN"} chars={Presets.ALPHANUM} length={16} />
            <span role="img" aria-label="train">🚂</span>
          </h1>
        </div>
        <p>Check the Status of your Amtrak train</p>
      </header>

      <form onSubmit={handleSubmitTrainNum}>
        <input
          type="text"
          value={trainNumber}
          onChange={(e) => setTrainNumber(e.target.value)}
          placeholder={"Train Number"}
        />
        <button type="submit">Search</button>
      </form>

      {errExists ? alertMsg : <TrainStatusTable details={trainDetails} />}

{loading
  ? <p>Loading all trains...</p>
  : <AllTrainsToday allTrains={allTrains} setTrainDetails={setTrainDetails} />}
    </div>
  );
}