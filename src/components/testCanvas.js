import React, { Component } from 'react';

class Test extends Component {
  componentDidMount() {
    const imageUrl = 'images/happycatapple/happycatapple-1.png';
    
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      console.log('Image loaded:', img.src);
    };
  }

  render() {
    const imageUrl = 'images/happycatapple/happycatapple-1.png';
    console.log(process.env.PUBLIC_URL);
    return (
      <div>
        <img src={(imageUrl)} alt="Local Image" />
      </div>
    );
  }
}

export default Test;
