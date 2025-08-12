import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function TrainStatusTable({ details, setShowAllTrains }: { details: TrainDetails | undefined; setShowAllTrains: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [allStops, setAllStops] = useState<boolean>(false);
  const [showAllStations, setShowAllStations] = useState<boolean>(true);
  const [station, setStation] = useState<string>("")

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
          {showAllStations ?
            details.stations.map((stationInfo, index) => {
              let delayedMinutes = (new Date(stationInfo.arr).getTime() - new Date(stationInfo.schArr).getTime()) / 60000
              const delayed = delayedMinutes >= 5

              if (!allStops && stationInfo.status === 'Departed') {
                return null
              }

              const handleRowClick = () => {
                setShowAllStations(false)
                setStation(stationInfo.code)
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
            })
            : 
            details.stations.map((stationInfo, index) => {
              if (station !== stationInfo.code) {
                return null
              }
              let delayedMinutes = (new Date(stationInfo.arr).getTime() - new Date(stationInfo.schArr).getTime()) / 60000
              const delayed = delayedMinutes >= 5

              if (!allStops && stationInfo.status === 'Departed') {
                return null
              }

              const handleRowClick = () => {
                if (station == "") {
                  setStation(stationInfo.code)
                  setShowAllStations(false)
                  return
                }
                setShowAllStations(true)
                setStation("")
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