import {
  BrowserRouter as Router,
  useLocation,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Home from './pages/home';

interface InitialPrefill {
  trainNumber?: string;
  stationCode?: string;
}

function parseInitialPrefill(search: string): InitialPrefill {
  const query = new URLSearchParams(search);
  const rawTrain = query.get('train');
  const rawStation = query.get('station');

  const train = rawTrain?.trim();
  const station = rawStation?.trim().toUpperCase();

  const trainNumber = train && /^\d+$/.test(train) ? train : undefined;
  const stationCode = station && /^[A-Z]{3}$/.test(station) ? station : undefined;

  return {
    trainNumber,
    stationCode,
  };
}

function AppRoutes() {
  const location = useLocation();
  const initialPrefill = parseInitialPrefill(location.search);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home initialTrainNumber={initialPrefill.trainNumber} initialStationCode={initialPrefill.stationCode} />}
      />
      {/* <Route path="/train/:trainNumber/station/:stationCode" element={<TrainStatusByStationPage />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <Router basename="/amtrak-train-status">
      <AppRoutes />
    </Router>
  );
}

export default App;
