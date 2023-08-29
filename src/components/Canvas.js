import React, { Component } from 'react';
import { getRandomEnemyType, Entities } from './Entities.js';



class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.$otherCanvas = null;

    this.animationFrameId = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.backImg = new Image();
    
    this.backImg.src = "images/background2.jpg"; 

    this.score =  0;
    this.highScore = 0;
    this.game = true;
    this.gaming = false;

    this.enemies = [];
    this.timer = 0;
    this.difficulty = [120];

    this.localPeerConnection = null;
    this.remotePeerConnection = null;

    this.localStream = null;
    this.remoteStream = null;
    this.localVideo = null;
    this.localMediaStream = null;
    // this.otherDescription = null;
    const { pageName } = this.props;

    this.backgroundX = 1150;

    this.state = {
      canvasDisplay : 'none',
      buttonHide : 'none'

    }

    if (this.canvas) {
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
    }

  }

  componentDidMount() {
    this.canvas = document.getElementById('myCanvas');
    this.$otherCanvas = document.getElementById('otherCanvas');
    this.localVideo = this.canvas;
    this.ctx = this.canvas.getContext('2d');
    
    this.backImg.onload = () => {
      this.ctx.drawImage(this.backImg,0,0,this.canvas.width,this.canvas.height);
      
      this.ctx.font = "80px serif";
      this.ctx.fillStyle = "#000000";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Happy Cat Jumping Game", this.canvas.width / 2, this.canvas.height / 2);

      this.ctx.font = "30px serif"
      this.ctx.fillText("please press Button", this.canvas.width / 2, 400, this.canvas.width / 2, this.canvas.height / 2);
    }

    this.entityConstructor();
    window.addEventListener('keydown', this.handleKeydown);

    // const { canvasData , onDataFromCanvas } = this.props;
    // onDataFromCanvas(this.canvas);
    // this.setState({otherCanvas : canvasData});
    // console.log(this.state.otherCanvas);
    // 여기까지 아주 잘 감.
    // console.log(canvasData);
    
    // this.startActions();

    // this.timer = 0;
    // this.timerOn = false;
    // this.userFrame = 0;
    // this.startAnimation();

  }

  componentWillUnmount() {
    this.stopAnimation();
    window.removeEventListener('keydown', this.handleKeydown);
  };

  startAnimation = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  stopAnimation = () => {
    cancelAnimationFrame(this.animationFrameId);
  }



  startActions = async () => {
    if(this.canvas) {
      await this.startAction();
      this.callAction();
    }
    
  }



  //------------------------------------    animate     ---------------------------------------
  // 동작 할 함수들
  animate = () => {
    if (this.me) {
      // this.ctx.beginPath(); // 새 경로 시작
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBackground();
      this.me.draw();
      this.me.Jump();
      this.spawnEnemy();
    }
    // this.calculateUserFrame();
    // 다시 넣음으로써 한프레임 지나면 발현.
    if (this.game) this.animationFrameId = requestAnimationFrame(this.animate);
    else this.defeatEntity.draw();

  }
  //------------------------------------    animate     ---------------------------------------

  drawBackground = () => {

    this.ctx.drawImage(this.backImg,this.backgroundX -1145,0,this.canvas.width,this.canvas.height);
    this.ctx.drawImage(this.backImg,this.backgroundX,0,this.canvas.width,this.canvas.height);
    if(this.backgroundX === 0) this.backgroundX = 1150
    else this.backgroundX -= 1;
  }
  
  //------------------------------------    enemySpawn     ---------------------------------------

  entityConstructor = () => {
    const CanvasProps = {
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      startAnimation: this.startAnimation,
    }

    this.me = new Entities.Me(CanvasProps);
    this.me.imageLoad();
    this.defeatEntity = new Entities.DefeatEntity(CanvasProps);

  }
  
  spawnEnemy = () => {
    const CanvasProps = {
      ctx: this.ctx,
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height,
      startAnimation: this.startAnimation,
    }

    this.timer++;
    if (this.timer % this.difficulty[0] === 0) {
      const enemyType = getRandomEnemyType();
      let enemy = new enemyType(CanvasProps);
      this.enemies.push(enemy);
    }
    // console.log(this.enemies);


    this.enemies.forEach((enemyEntity, enemyIndex, thisArray) => {

      if (enemyEntity.x < -20) { thisArray.splice(enemyIndex, 1); }
      if (enemyEntity.imageLoaded) {

        this.isCrush(this.me, enemyEntity);
        enemyEntity.draw();
        enemyEntity.move();
      }
      else enemyEntity.imageLoad();


    });

  }
  //------------------------------------    enemySummon      ---------------------------------------

  



  //------------------------------------    crush     ---------------------------------------

  isCrush = (me, enemy) => {

    // 1. 적이 가만히 있는 경우
    let xDif = me.x - (enemy.x + enemy.width);
    let yDif = enemy.y - (me.y + me.height);

    if (enemy.x > 40) {
      xDif = enemy.x - (me.x + me.width);
    }

    if (enemy.y < me.defaultY) {
      yDif = me.y - (enemy.y + enemy.height);
    }


    if (xDif < 0 && yDif < 0) {
      // this.defeatEntity.draw();

      cancelAnimationFrame(this.animation);
      this.game = false;
      // this.componentWillUnmount();
      // ctx.drawImage(DefeatImg, 0, $canvas.height/2 -150, 150, 150);




      //최고기록 저장
      // if(score > highScore){
      // highScore = score;
      // localStorage.setItem('highScore', highScore);
      // }  
    }

  }
  //------------------------------------    crush     ---------------------------------------


  //------------------------------------    keydownEvent     ---------------------------------------

  handleKeydown = (event) => {
    const jumpKey = ['Space', 'ArrowUp', 'KeyW'];
    const standKey = ['ArrowDown', 'KeyS']
    const resetKey = ['KeyR']
    const frameKey = ['KeyF']

    if (jumpKey.includes(event.code)) {
      console.log(event.code)
      if (!this.me.IsJumpNow) {
        this.me.isJumping = true;
        this.me.isStanding = false;
      }

      if (!this.game) {
        window.location.reload();
        this.game =  true;
      }
    }

    if (standKey.includes(event.code)) this.me.isStanding = true;


    if (resetKey.includes(event.code)) {
      this.setState({ meIsResetting: true })

    }

    if (frameKey.includes(event.code)) {
      this.setState({ meIsResetting: true })
    }
  };

  soloPlay = () => {
    if(this.game && !this.gaming) {
      this.startAnimation();
      this.gaming = true;
    }
  
  }

  callOffer = () => {
    if(this.game && !this.gaming) {
    this.setState({
      canvasDisplay : 'block',
      buttonHide : 'flex',
  });
    this.startActions();

    
    }
  }
  
  //------------------------------------    keydownEvent     ---------------------------------------

  startAction = async () => {
    // const mediaStreamContraints = {
    //   width : 1150,
    //   height : 500,
    // }

    const mediaStream = this.canvas.captureStream(120); // 120 FPS
    console.log(mediaStream);
    // const mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamContraints)

    this.gotLocalMediaStream(mediaStream);

    // .then().catch(this.handelLocalMediaStreamError);
    console.log('Requesting local Stream')
  }

  gotLocalMediaStream = (mediaStream) => {
    this.localVideo.srcObject = mediaStream;
    this.localStream = mediaStream;
    console.log('Received local Stream')
  }

  callAction = () => {
    console.log('Starting call.');

    // const videoTracks = this.localStream.getTrackById("myCanvas");
    // if(videoTracks.length > 0){
    //   console.log(`Using vedio device : ${videoTracks[0].label}`)
    // }

    const servers = null;
    // iceServers key
    // stun server를 찾는 거라서 null은 로컬만 사용가능으로 추측.
    // const servers = 'http://localhost:3000/'; //Allows for RTC server configuration.

    const offerOptions = {
      iceRestart : false,
      // offerToReceiveVideo : 1,
    }


    // 송신자 역할.
    this.localPeerConnection = new RTCPeerConnection(servers);

    console.log('Created local peer connection object localPeerConnection');
    
    this.localPeerConnection.addEventListener('icecandidate',this.handleConnection);
    // ice 후보가 수신되면 다른 피어에게 보내기.
    this.localPeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);
    // ice 후보가 변경되면 다른 피어에게 보내기.

    // 수신자 역할.
    this.remotePeerConnection = new RTCPeerConnection(servers);
    // 동일한 ICE 서버로 통신.
    
    this.remotePeerConnection.addEventListener('iceconnectionstatechange', this.handleConnectionChange);

    this.remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);
    
    // 전달해 줄 정보로 인식 일단은

    //addStream 이벤트 발생, gotRemoteMediaStream 수신자가, localStream인 
    this.localPeerConnection.addStream(this.localStream);

    // console.log("after localPeerConnection");

    this.localPeerConnection.createOffer(offerOptions)
    .then(this.createdOffer).catch(this.setSessionDescriptionError);
  
  }

  getOtherPeer = (peerConnection) => {
    return (peerConnection === this.localPeerConnection) ?
    this.remotePeerConnection : this.localPeerConnection;
  }

  getPeerName(peerConnection){
    return(peerConnection === this.localPeerConnection) ?
    'localPeerConnection' : 'remotePeerConnection'
  }

  handleConnection = (event) => {
    console.log(event.candidate);
    const peerConnection = event.target;
    const iceCandidate = event.candidate;

    if(iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      const otherPeer = this.getOtherPeer(peerConnection);
      console.log(newIceCandidate, otherPeer);

      otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        this.handleConnectionSuccess(peerConnection);
      }).catch((error) => {
        console.log("Error", error);
        // this.handleConnectionFailure(peerConnection, error);
      });


    }
  }

  handleConnectionChange = (event) => {
    const peerConnection = event.target;
    console.log('ICE state change event: ', event);
    console.trace(`${this.getPeerName(peerConnection)} ICE state: ` +
    `${peerConnection.iceConnectionState}.`);
  }

  handleConnectionSuccess = (peerConnection) => {
    console.trace(`${this.getPeerName(peerConnection)}addIcdCandidate success`);

  }

  gotRemoteMediaStream = (event) => {
    // 수신자
    console.log("gotRemoteMediaStream");

    const mediaStream = event.stream;
    this.$otherCanvas.srcObject = mediaStream;
    this.remoteStream = mediaStream;
    
  }


  createdOffer = (description) => {
    console.log("createdOffer", description);

    this.localPeerConnection.setLocalDescription(description)
    .then(() => {
      this.setLocalDescriptionSuccess(this.localPeerConnection);
      // session에 offer 저장, 나온 description(SDP)는 A를 B에 B는 A에 저장한다.
      const DescriptionString = JSON.stringify({
        type : description.type,
        sdp : description.sdp
      });
      // console.log(DescriptionString);
      localStorage.setItem(`offerState${this.props.pageName}`, DescriptionString);
      // localStorage.setItem(`offerState${this.props.pageName}`, description);

      // this.otherDescription = this.getOtherComponentDescription(this.props.pageName);
      // console.log(this.otherDescription);
  
      // console.log("createdOffer localPeerConnection");
      
    }).catch((error) => this.setSessionDescriptionError(error, "localPeerConnection"));

    

    // console.log("createdOffer remotePeerConnection");
    
    // answer부분 당연히 독립적인 버튼으로 실행
    // this.remotePeerConnection.createAnswer()
    // .then(this.createdAnswer)
    // .catch(this.setSessionDescriptionError);
  }
  setRemoteOffer = () => {

    const otherDescription = this.getOtherComponentDescription(this.props.pageName);
    // console.log(otherDescription);

    this.remotePeerConnection.setRemoteDescription(otherDescription)
    .then(() => {
      console.log(otherDescription);
      this.setRemoteDescriptionSuccess(this.remotePeerConnection);
    }).catch((error) => 
    {
      console.log('here');
      this.setSessionDescriptionError(error, "remotePeerConnection")
    
    });

    this.remotePeerConnection.createAnswer()
    .then(this.createdAnswer)
    .catch(this.setSessionDescriptionError);
    
  }

  getOtherComponentDescription = (pageName) => {
    let otherpageName = 0;
    console.log("getOtherComponentDescription");

    if(pageName === 1) otherpageName = 2;
    else otherpageName = 1;
    const offerString = localStorage.getItem(`offerState${otherpageName}`);
    if (offerString) {
      try {
        const offer = JSON.parse(offerString);
        return offer;
      // offer 객체를 사용하여 작업 수행
      } catch (error) {
        console.error("Error parsing offer:", error);
     }
      } else {
        console.error("Offer not found in storage.");
    }
    // const otherOffer = localStorage.getItem(`offerState${otherpageName}`);
    // console.log((otherOffer));
    // const test = JSON.parse(otherOffer);
    // const otherOffer = localStorage.getItem(`offerState${otherpageName}`);

    // return otherOffer;
  }

  createdAnswer = (description) => {
    console.log("answer",description)
    this.remotePeerConnection.setLocalDescription(description)
    .then(() => {
      this.setLocalDescriptionSuccess(this.remotePeerConnection);
    }).catch(this.setSessionDescriptionError);

    this.localPeerConnection.setRemoteDescription(description)
    .then(() => {
      this.setRemoteDescriptionSuccess(this.localPeerConnection);
    }).catch(this.setSessionDescriptionError)
  }

  setDescriptionSuccess = (peerConnection) => {
    const peerName = this.getPeerName(peerConnection);
    console.trace(`${peerName} complete`);

  }

  setLocalDescriptionSuccess = (peerConnection) => {
    this.setDescriptionSuccess(peerConnection);
  }

  setRemoteDescriptionSuccess = (peerConnection) => {
    this.setDescriptionSuccess(peerConnection);

  }

  setSessionDescriptionSuccess = (peerConnection) => {
    const peerName = this.getPeerName(peerConnection);
    console.trace(`${peerName} complete`)
  }

  setSessionDescriptionError = (error, type) => {
    console.trace(type, `Failed to create session description : ${error}`)
  }

  render() {
    const {canvasData} = this.props;

    return (
      <div >
        <canvas
          id="myCanvas"
          width={1150}
          height={500}
          style={{ display: 'block', margin: 'auto', border: '1px solid black' }}

        />
        <br/>
        <button onClick = {() => this.soloPlay()}>
          Play
        </button>

        <button onClick = {() => this.callOffer()}>
          playwithOther
        </button>

        <button style = {{display : this.state.buttonHide}} onClick = {() => this.setRemoteOffer()}>
          connecting
        </button>

        {/* <button style = {{display : this.state.canvasDisplay}} onClick = {() => this.ready()}>
          ready
        </button> */}

        <br/>
        {/* <canvas
          id="otherCanvas"
          width={1150}
          height={500}
          style={{ display: 'block', margin: 'auto', border: '1px solid black' }}

        /> */}
        <video id = "otherCanvas" autoPlay playsInline
        width = {1150}
        height= {500}
        style={{ display: this.state.canvasDisplay, margin: 'auto', border: '1px solid black' }}

        ></video>
      </div>

    )

  }

};


export default Canvas;

  // this.enemy = new Entities.Enemy(CanvasProps);
    // this.basicCat = new Entities.BasicCat(CanvasProps);
    // this.maxWellCat = new Entities.MaxWellCat(CanvasProps);
    // this.happyCat = new Entities.HappyCat(CanvasProps);

    // const entitiesArray = [Entities.BasicCat, Entities.MaxWellCat, Entities.HappyCat];

    // for (let i = 0; i < entitiesArray.length; i++) {
    //   for (let j = 0; j < 4; j++) {
    //     let entityName = entitiesArray[i].name.toLowerCase() + (j + 1);
    //     this[entityName] = new entitiesArray[i](CanvasProps);
    //     this[entityName].imageLoad();
    //     this.enemies.push(this[entityName]);

    //     // console.log("다 가셨네", this[entityName]);
    //   }
    // }

    // this.basicCat.imageLoad();
    // this.maxWellCat.imageLoad();
    // this.happyCat.imageLoad();

  

  // spawnEnemy = () => {
  //   this.timer++;
  //   if (this.timer % this.difficulty[3] === 0) {
  //     // const enemyType = getRandomEnemyType();
  //     const enemyIndexArray = [0, 4, 8];
  //     let [basicCat, maxWellCat, happyCat] = enemyIndexArray;

  //     const getRandomEnemyType = () => { // 에외 처리 생각할 것
  //       const randomEnemyType = Math.random();
  //       if (randomEnemyType < 0.6 ) return ("basicCat" + basicCat++);
  //       else if (randomEnemyType < 0.9) return ("maxWellCat" + maxWellCat++);
  //       else return  ("happyCat" + happyCat++);
  //     }


  //     this.enemies.push(this[getRandomEnemyType()]);
  //     console.log(this[getRandomEnemyType()]);
  //     console.log(getRandomEnemyType());

  //   }



  //   // console.log(this.enemies);
  //   // }

  //   this.enemies.forEach((enemyEntity, enemyIndex, o) => {
  //     if (enemyEntity.x < -40) {
  //       o.splice(enemyIndex, 1);
  //       // enemyEntity.name();
  //     }
  //     this.isCrush(this.me, enemyEntity);
  //     console.log(enemyEntity);
  //     enemyEntity.draw();
  //     enemyEntity.move();



  //   });
  // }

//------------------------------------    userFrame     ---------------------------------------

// calculateUserFrame = () => {
//   this.userFrame += 1;
//   if(!this.timerOn){
//     // console.log(this.timerOn);

//     this.timerOn = true;

//     this.timerInterval = setInterval( () => {
//       this.timer += 1;
//       console.log(this.timer);

//       this.timerOn = false;
//     }, 1000);

//   }
//   // console.log(this.timerOn);
//   // console.log(this.userFrame);
//   // console.log(this.timer);
//   if(this.timer ===0) this.ctx.fillText("Loading...", 1000, 100);
//   else this.ctx.fillText("fps : "+ (this.userFrame / this.timer), 1000, 100);


// }
//------------------------------------    userFrame     ---------------------------------------
