import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import TrainStatusByStationPage from './pages/trainStatusByStation';



function App() {
  return (
    <Router basename="/amtrak-train-status">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/train/:trainNumber/station/:stationCode" element={<TrainStatusByStationPage />} />
      </Routes>
    </Router>
  );
}



export default App;
