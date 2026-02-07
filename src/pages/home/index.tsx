import { useEffect, useState } from "react";
import TrainStatusTable from "../../components/trainStatusTable";
import { TrainDetails } from "../../types";
import SplitFlap, { Presets } from "react-split-flap";
import AllTrainsToday from "../../components/allTrains";
import { useLocation, useNavigate } from "react-router-dom";

interface HomeProps {
  initialTrainNumber?: string;
  initialStationCode?: string;
}

export default function Home({ initialTrainNumber, initialStationCode }: HomeProps) {
  const [trainDetails, setTrainDetails] = useState<TrainDetails>()
  const [allTrains, setAllTrains] = useState<Map<string, TrainDetails>>(new Map<string, TrainDetails>())
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllTrains, setShowAllTrains] = useState<boolean>(true)
  const [refresh, setRefresh] = useState<number>(0)
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [selectedStationCode, setSelectedStationCode] = useState<string | undefined>(initialStationCode);
  const location = useLocation();
  const navigate = useNavigate();

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
        const msg = `Failed to fetch data for trains: ${error}`;
        console.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, [refresh]);

  useEffect(() => {
    if (loading || isHydrated) {
      return;
    }

    if (!initialTrainNumber) {
      setIsHydrated(true);
      return;
    }

    const matchedTrain = Array.from(allTrains.values()).find((train) => train.trainNum === initialTrainNumber);

    if (matchedTrain) {
      setTrainDetails(matchedTrain);
      setShowAllTrains(false);
    }

    setIsHydrated(true);
  }, [allTrains, initialTrainNumber, isHydrated, loading]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const nextQuery = new URLSearchParams();

    if (!showAllTrains && trainDetails?.trainNum) {
      nextQuery.set("train", trainDetails.trainNum);
      const hasSelectedStation = selectedStationCode && trainDetails.stations.some(
        (stationInfo) => stationInfo.code.toUpperCase() === selectedStationCode.toUpperCase(),
      );

      if (hasSelectedStation) {
        nextQuery.set("station", selectedStationCode!.toUpperCase());
      }
    }

    const nextSearch = nextQuery.toString();
    const currentSearch = location.search.replace(/^\?/, "");

    if (nextSearch === currentSearch) {
      return;
    }

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch ? `?${nextSearch}` : "",
      },
      { replace: true },
    );
  }, [isHydrated, location.pathname, location.search, navigate, selectedStationCode, showAllTrains, trainDetails]);


  return (
    <div className="App">
      <header className="App-header">
        <div className="center-container">
          <h1 className="flip-title title-row">
            <SplitFlap value={"TRACK YOUR TRAIN"} chars={Presets.ALPHANUM} length={16} />
            <span role="img" aria-label="train">🚂</span>
          </h1>
          <h1 className="flip-title title-row">
            <SplitFlap value={new Date().toLocaleDateString()} chars={Presets.NUM} length={new Date().toLocaleDateString().length} />
          </h1>
        </div>
        <p>{showAllTrains ? "Search Your Amtrak Train Using the Filters Below" : ""}</p>
        <button onClick={(e) => {
        setRefresh(refresh+1)
      }} type="submit">Refresh</button>
      </header>

      {!showAllTrains && trainDetails ? (
        <TrainStatusTable
          details={trainDetails}
          setShowAllTrains={setShowAllTrains}
          initialStationCode={initialStationCode}
          onStationChange={setSelectedStationCode}
        />
      ) : ""}

      {showAllTrains ? loading
        ? <p>Loading all trains...</p>
        : <AllTrainsToday allTrains={allTrains} setTrainDetails={setTrainDetails} setShowAllTrains={setShowAllTrains} /> : ""}
    </div>
  );
}
