import { Link } from "react-router-dom";
import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";

export default function TrainStatusTable({ details }: { details: TrainDetails | undefined }) {
  if (!details) return (<h3>Search for a train or select from the table below.</h3>);

  const trainNumber = details.trainNum;
  const alert = (details.alerts.length && details.alerts.length > 0) ? `⚠️ ${details.alerts[0].message}` : ""

  return (
    <div className="train-status-container">
      <h3>Complete Timetable For Train</h3>
      <SplitFlap value={trainNumber} chars={Presets.NUM} length={trainNumber.toString().length} />
      <h2>{alert}</h2>
      <table>
        <thead>
          <tr>
            <th>Share</th>
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

            return (
              <tr key={index}>
                <td className="share-status-link">
                  <Link to={`/train/${trainNumber}/station/${stationInfo.code}`}>
                    🔗
                  </Link>
                </td>
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