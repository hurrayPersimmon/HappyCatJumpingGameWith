import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Canvas from './components/Canvas';
import { CanvasProvider } from './components/CanvasProvider';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFromCanvas1: null,
      dataFromCanvas2: null,
    }
  }

  handleDataFromCanvas1 = (data) => {
    console.log('handleDataFromCanvas1', data);
    //setState의 비동기처리? 여기서부터 setState가 안됨.
    this.setState({ dataFromCanvas1: data });
    console.log(this.state.dataFromCanvas1);

  };

  handleDataFromCanvas2 = (data) => {
    this.setState({ dataFromCanvas2: data });

  };

  componentDidMount() {
    document.title = "Happy Happy Happy Happy Happy Happy Happy Happy Happy";
  }

  render() {
    return (
      // <CanvasProvider>
      <Router>
        <Routes>
          <Route path="/1"
            element={<Canvas canvasData={this.state.dataFromCanvas2}
              onDataFromCanvas={this.handleDataFromCanvas1}
            />} />
            <Route path="/2"
            element={<Canvas canvasData={this.state.dataFromCanvas1}
              onDataFromCanvas={this.handleDataFromCanvas2}
            />} />
        </Routes>
      </Router>
      // </CanvasProvider>

    );
  }
}

export default App;
