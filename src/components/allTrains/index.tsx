import { TrainDetails } from "../../types";

export default function AllTrainsToday({ allTrains, setTrainDetails }: { allTrains: Map<string, TrainDetails>; setTrainDetails: (details: TrainDetails) => void }) {
    return (
        <div className="train-status-container">
            <h3>All Trains Today {new Date().toLocaleDateString()}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Route Name</th>
                        <th>Number</th>
                        <th>Origin</th>
                        <th>Destination</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(allTrains.entries()).map(([key, train]) => {
                        const alertMsg = train.alerts.length ? `${train.alerts[0].message}` : "No Alerts"
                        const existingAlert = train.alerts.length > 0
                        return (
                            <tr key={key} onClick={() => setTrainDetails(train)}
                                style={{ cursor: "pointer" }}>
                                <td> {existingAlert ? `⚠️ ${train.routeName}` : train.routeName}</td>
                                <td >{train.trainNum}</td>
                                <td >{train.origName}</td>
                                <td >{train.destName}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}