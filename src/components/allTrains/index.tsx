import { useState } from "react";
import { TrainDetails } from "../../types";
import { Link } from "react-router";

export default function AllTrainsToday({ allTrains, setTrainDetails, setShowAllTrains }: { allTrains: Map<string, TrainDetails>; setTrainDetails: (details: TrainDetails) => void; setShowAllTrains: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [searchRouteName, setSearchRouteName] = useState<string>('')
    const [searchTrainNumber, setSearchTrainNumber] = useState<string>('')
    const [searchOrigin, setSearchOrigin] = useState<string>('')
    const [searchDestination, setSearchDestination] = useState<string>('')
    return (
        <div className="train-status-container">
            <table>
                <tr>
                    <th><input type="text" id="myInput" onChange={(e) => setSearchRouteName(e.target.value)} placeholder="Search Route Name"></input></th>
                    <th><input type="text" id="myInput" onChange={(e) => setSearchTrainNumber(e.target.value)} placeholder="Search Train Number"></input></th>
                    <th><input type="text" id="myInput" onChange={(e) => setSearchOrigin(e.target.value)} placeholder="Search Origin"></input></th>
                    <th><input type="text" id="myInput" onChange={(e) => setSearchDestination(e.target.value)} placeholder="Search Destination"></input></th>
                </tr>
            </table>
            <table>
                <thead>
                    <tr>
                        {/* <th>Schedule</th> */}
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
                        if (!train.routeName.toUpperCase().startsWith(searchRouteName.toUpperCase())) {
                            return
                        }

                        if (!train.trainNum.toUpperCase().startsWith(searchTrainNumber.toUpperCase())) {
                            return
                        }

                        if (!train.origName.toUpperCase().startsWith(searchOrigin.toUpperCase())) {
                            return
                        }

                        if (!train.destName.toUpperCase().startsWith(searchDestination.toUpperCase())) {
                            return
                        }

                        return (
                            <tr key={key} onClick={() => {
                                setTrainDetails(train)
                                setShowAllTrains(false)
                            }
                            }
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