// CanvasComponent.js

import React, { Component } from 'react';
import  BaseEntity, { CustomEntity } from './testCanvas.js';

class CanvasComponent extends Component {
  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    this.customEntity = new CustomEntity(this.ctx, this.canvasWidth, this.canvasHeight);

    this.animate();
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.customEntity.draw();
    requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <canvas
        ref="canvas"
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
      />
    );
  }
}

export default CanvasComponent;
