import { Link } from "react-router-dom";
import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function TrainStatusTable({ details, setShowAllTrains }: { details: TrainDetails | undefined; setShowAllTrains: React.Dispatch<React.SetStateAction<boolean>> }) {
  const navigate = useNavigate();
  const [allStops, setAllStops] = useState<boolean>(false);

  if (!details) return null;
  const trainNumber = details.trainNum;
  const routeHeader = details.routeName;
  const trainNumHeader = `Train ${trainNumber}`
  const alert = (details.alerts.length && details.alerts.length > 0) ? `⚠️ ${details.alerts[0].message}` : ""


  return (
    <div className="train-status-container">
      <button onClick={(e) => {
        setShowAllTrains(true)
      }} type="submit">Show All Trains</button>
      <br />
      <SplitFlap value={routeHeader} chars={Presets.ALPHANUM} length={routeHeader.toString().length} />
      <br />
      <SplitFlap value={trainNumHeader} chars={Presets.ALPHANUM} length={trainNumHeader.toString().length} />
      <h2>{alert}</h2>
      <span className="toggle-labels">
        Remaining Stops
        <label className="switch">
          <input checked={allStops} onChange={() => setAllStops(!allStops)} type="checkbox" />
          <span className="slider round"></span>
        </label> All Stops
      </span>
      <table>
        <thead>
          <tr>
            <th>Station</th>
            <th>Status</th>
            <th>Scheduled Arrival</th>
            <th>Expected Arrival</th>
            <th>Notice</th>
          </tr>
        </thead>
        <tbody>
          {details.stations.map((stationInfo, index) => {
            let delayedMinutes = (new Date(stationInfo.arr).getTime() - new Date(stationInfo.schArr).getTime()) / 60000
            const delayed = delayedMinutes >= 5

            if (!allStops && stationInfo.status === 'Departed') {
              return null
            }

            const handleRowClick = () => {
              navigate(`/train/${trainNumber}/station/${stationInfo.code}`);
            };

            return (
              <tr key={index} onClick={handleRowClick} style={{ cursor: 'pointer' }}>
                <td >{stationInfo.name}</td>
                <td >{stationInfo.status}</td>
                <td >{new Date(stationInfo.schArr).toLocaleString()}</td>
                <td >{new Date(stationInfo.arr).toLocaleString()}</td>
                <td >{delayed ? `‼️ Delayed ${delayedMinutes} Minutes` : `🟢 On Time`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}