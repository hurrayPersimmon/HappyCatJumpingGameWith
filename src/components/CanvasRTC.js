import React, { Component } from "react";

class CanvasRTC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rtcConnection: null,
        };

        this.localStream;
        this.$canvas = document.getElementById('myCanvas');
        this.$otherCanvas = document.getElementById('otherCanvas');
    }



    conponentDidMount() {
        this.setupRTC();
    }




render() {
    return null;
}
}