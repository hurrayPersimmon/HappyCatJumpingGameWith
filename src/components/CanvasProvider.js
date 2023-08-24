import React, { createContext, useContext, Component } from 'react';

const CanvasContext = createContext();

export class CanvasProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasData: null,
      route : null,
    };
  }

  setCanvasData = (canvas, route) => {
    this.setState({ canvasData: canvas, route: route});
  };

  render() {
    return (
      <CanvasContext.Provider
        value={{ canvasData: this.state.canvasData, setCanvasData: this.setCanvasData }}
      >
        {this.props.children}
      </CanvasContext.Provider>
    );
  }
}

export const useCanvasContext = () => useContext(CanvasContext);
