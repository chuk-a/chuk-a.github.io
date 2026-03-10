import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Presentation from './Presentation';
import { GargantuaPage } from './components/GargantuaPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Presentation />} />
                <Route path="/blackhole" element={<GargantuaPage />} />
            </Routes>
        </Router>
    );
}

export default App;
