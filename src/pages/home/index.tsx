import { useEffect, useState } from "react";
import TrainStatusTable from "../../components/trainStatusTable";
import { Station, TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import { useParams } from "react-router-dom";

export default function Home() {
  const {train, station} = useParams();
  const [trainNumber, setTrainNumber] = useState<string>('');
  const [stationCode, setStationCode] = useState<string>('');
  const [trainDetails, setTrainDetails] = useState<TrainDetails[]>([])
  const [allStops, setAllStops] = useState<Station[]>([])
  const [alertMsg, setAlertMsg] = useState<string>('')
  const [errExists, setErrExists] = useState<boolean>(false)



  const handleSubmitTrainNum = (event: React.FormEvent<HTMLFormElement>) => {
    setErrExists(false)
    event.preventDefault();
    if (!trainNumber) {
      return
    }

    try {
      fetch(`https://api-v3.amtraker.com/v3/trains/${trainNumber}-${new Date().getDate()}`)
        .then((response) => response.json())
        .then((data: Record<string, TrainDetails[]>) => {
          if (!data[trainNumber] || !data[trainNumber].length) {
            setAlertMsg(`No routes for train ${trainNumber} found for ${new Date().toLocaleDateString()}`)
            console.log(alertMsg);
            setErrExists(true)
          }
          setTrainDetails(data[trainNumber]);
          console.log(trainDetails)
        })
    } catch (error) {
      setErrExists(true)
      setAlertMsg(`Failed to fetch data for train ${trainNumber}: ${error}`)
      console.error(alertMsg)
    }
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

      {errExists? alertMsg : <TrainStatusTable details={trainDetails} />}

    </div>
  );
}