import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import { useEffect, useRef, useState } from "react";

export default function TrainStatusTable({
  details,
  setShowAllTrains,
  initialStationCode,
  onStationChange,
}: {
  details: TrainDetails | undefined;
  setShowAllTrains: React.Dispatch<React.SetStateAction<boolean>>;
  initialStationCode?: string;
  onStationChange?: (stationCode: string | undefined) => void;
}) {
  const [allStops, setAllStops] = useState<boolean>(false);
  const [showAllStations, setShowAllStations] = useState<boolean>(true);
  const [station, setStation] = useState<string>("")
  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const prefilledStationApplied = useRef<boolean>(false);

  useEffect(() => {
    if (prefilledStationApplied.current || !initialStationCode || !details) {
      return;
    }

    const matchedStation = details.stations.find(
      (stationInfo) => stationInfo.code.toUpperCase() === initialStationCode.toUpperCase(),
    );

    prefilledStationApplied.current = true;

    if (!matchedStation) {
      onStationChange?.(undefined);
      return;
    }

    setStation(matchedStation.code);
    setShowAllStations(false);
    onStationChange?.(matchedStation.code);
  }, [details, initialStationCode, onStationChange]);

  if (!details) return null;
  const trainNumber = details.trainNum;
  const routeHeader = details.routeName;
  const trainNumHeader = `Train ${trainNumber}`
  const alert = (details.alerts.length && details.alerts.length > 0) ? `⚠️ ${details.alerts[0].message}` : ""

  const handleCopyShareLink = async () => {
    if (!navigator.clipboard || !window.isSecureContext) {
      setCopyFeedback("Unable to copy link in this browser context.");
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyFeedback("Share link copied.");
    } catch {
      setCopyFeedback("Failed to copy share link.");
    }
  };


  return (
    <div className="train-status-container">
      <button onClick={(e) => {
        setShowAllTrains(true)
        onStationChange?.(undefined);
      }} type="submit">Show All Trains</button>
      <button onClick={handleCopyShareLink} type="button">Copy share link</button>
      {copyFeedback ? <p>{copyFeedback}</p> : null}
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
                onStationChange?.(stationInfo.code);
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
                if (station === "") {
                  setStation(stationInfo.code)
                  setShowAllStations(false)
                  return
                }
                setShowAllStations(true)
                setStation("")
                onStationChange?.(undefined);
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
