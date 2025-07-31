import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Station, TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import TrainStatusTable from "../../components/trainStatusTable";



export default function TrainStatusByStationPage() {
  const {trainNumber, stationCode } = useParams();
  const [manualTrainNum, setManualTrainNum] = useState<string>('')
  const [stationInfo, setStationInfo] = useState<Station | null>(null);
  const [alertMsg, setAlertMsg] = useState<string>('')
  const [errExists, setErrExists] = useState<boolean>(false)
  const [trainDetails, setTrainDetails] = useState<TrainDetails[]>([])


  const handleSubmitTrainNum = (event: React.FormEvent<HTMLFormElement>) => {
    setErrExists(false)
    event.preventDefault();
    if (!manualTrainNum) {
      return
    }

    try {
      fetch(`https://api-v3.amtraker.com/v3/trains/${manualTrainNum}-${new Date().getDate()}`)
        .then((response) => response.json())
        .then((data: Record<string, TrainDetails[]>) => {
          if (!data[manualTrainNum] || !data[manualTrainNum].length) {
            setAlertMsg(`No routes for train ${trainNumber} found for ${new Date().toLocaleDateString()}`)
            console.log(alertMsg);
            setErrExists(true)
          }
          setTrainDetails(data[manualTrainNum]);
          console.log(trainDetails)
        })
    } catch (error) {
      setErrExists(true)
      setAlertMsg(`Failed to fetch data for train ${trainNumber}: ${error}`)
      console.error(alertMsg)
    }
  }

  
  useEffect(() => {
    try {
      fetch(`https://api-v3.amtraker.com/v3/trains/${trainNumber}-${new Date().getDate()}`)
        .then((response) => response.json())
        .then((data: Record<string, TrainDetails[]>) => {
          if (!data[trainNumber!] || !data[trainNumber!].length) {
            setAlertMsg(`No routes for train ${trainNumber} found for ${new Date().toLocaleDateString()}`)
            console.log(alertMsg);
            setErrExists(true)
          }
          setTrainDetails(data[trainNumber!]);
          console.log(trainDetails)
          const train = data[trainNumber!]?.[0];
          const station = train.stations.find((s) => s.code === stationCode);
          setStationInfo(station || null);
        })
    } catch (error) {
      setErrExists(true)
      setAlertMsg(`Failed to fetch data for train ${trainNumber}: ${error}`)
      console.error(alertMsg)
    }

  }, [trainNumber, stationCode])

  if (!stationInfo) {
    return (
      <div className="App-header">
        <div className="train-wrapper">
          <div className="train-animation-center-container">
            <div className="semi-circle-front">
            </div>
            <div className="leftbox">
              <div className="small-circle-front">
              </div>
              <div className="small-circle-rear">
              </div>
              <div className="wheel-rec-1">
              </div>
              <div className="wheel-rec-2">
              </div>
              <div className="arrow-down">
              </div>
              <div className="arrow-left">
                <div className="arrow-left-in">
                </div>
              </div>
              <div className="pipe">
              </div>
            </div>
            <div className="rightbox">
              <div className="big-circle">
              </div>
              <div className="window">
              </div>
              <div className="roof">
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  };
  let delayedMinutes = (new Date(stationInfo!.arr).getTime() - new Date(stationInfo!.schArr).getTime()) / 60000
  const delayed = delayedMinutes >= 5
  const expectedArrival = new Date(stationInfo!.arr).toLocaleString([], { hour: '2-digit', minute: '2-digit' });
  const scheduledArrival = new Date(stationInfo!.schArr).toLocaleString([], { hour: '2-digit', minute: '2-digit' });

  const trainNumberTitle = `Train ${trainNumber}`
  const stationTitle = `${stationInfo.name} Station`

  return (
    <div className="App">
      <header className="App-header">
        <div className="center-container">
          <h1 >
            <SplitFlap value={trainNumberTitle} chars={Presets.ALPHANUM} length={trainNumberTitle.length} />
          </h1>
          <h1 className="flip-title title-row">
            <SplitFlap value={stationTitle} chars={Presets.ALPHANUM} length={stationTitle.length} />
            <span role="img" aria-label="train">🚂</span>
          </h1>
        </div>
      </header>
            <form onSubmit={handleSubmitTrainNum}>
        <input
          type="text"
          value={manualTrainNum}
          onChange={(e) => setManualTrainNum(e.target.value)}
          placeholder={"Train Number"}
        />
        <button type="submit">Search</button>
      </form>
      <p className="station-detail">
        <strong>Status:</strong>{" "}
        {delayed ? `‼️ Delayed ${Math.round(delayedMinutes)} Minutes` : `🟢 On Time`}
      </p>
      <p className="station-detail">
        <strong>Scheduled Arrival:</strong> {scheduledArrival}
      </p>
      <p className="station-detail">
        <strong>Expected Arrival:</strong> {expectedArrival}
      </p>
    </div>
  );

}

