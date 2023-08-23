import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Canvas from './components/Canvas';
import Test from './components/test';
import CanvasComponent from './components/test';

function App() {
  document.title = "Happy Happy Happy Happy Happy Happy Happy Happy Happy";
  

  return (
    <Router>
      <Routes>
        <Route path= "/1" element={<Canvas/>} />
        <Route path= "/2" element={<Canvas/>} />


      </Routes>
      {/* <CanvasComponent/> */}

    </Router>
  );
}

export default App;
