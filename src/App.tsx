import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import MapPage from './pages/Map/MapPage';
import AppealsPage from './pages/AppealsPAge/AppealsPage';
import 'mapbox-gl/dist/mapbox-gl.css';
import DistrictsMap from './pages/DistrictsMap/DistrictsMap';
import AboutPage from "./pages/AboutPage/AboutPage";

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/appeals" element={<AppealsPage />} />
                    <Route path="/districts-map" element={<DistrictsMap />} />
                    <Route path="/about" element={<AboutPage/>} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
