import React, { Component } from 'react';
import { getRandomEnemyType, Entities } from './Entities.js';


class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = document.getElementById('myCanvas');
    this.$otherCanvas = document.getElementById('otherCanvas');
    this.animationFrameId = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.backImg = new Image();
    this.backImg.src = "images/background-1.png"; 

    this.score =  0;
    this.highScore = 0;
    this.game = true;

    this.enemies = [];
    this.timer = 0;
    this.difficulty = [120];

    this.localPeerConnection = null;
    this.remotePeerConnection = null;

    this.localStream = null;
    this.remoteStream = null;
    this.localVideo = null;




    if (this.canvas) {
      this.canvasWidth = this.canvas.width;
      this.canvasHeight = this.canvas.height;
    }

  }
    startAction = () => {
      const mediaStreamContraints = {
        video : true,
      }
      navigator.mediaDevices.getUserMedia(mediaStreamContraints)
      .then(this.gotLocalMediaStream).catch(this.handelLocalMediaStreamError);
      console.log('Requesting local Stream')
    }

    gotLocalMediaStream = (mediaStream) => {
      this.localVideo.srcObject = mediaStream;
      this.localStream = mediaStream;
      console.log('Received local Stream')
    }

    callAction = () => {
      console.trace('Starting call.');

      const videoTracks = this.localStream.getVideoTracks();
      if(videoTracks.length > 0){
        console.log(`Using vedio device : ${videoTracks[0].label}`)
      }

      const servers = 'http://localhost:3000/'; //Allows for RTC server configuration.

      const offerOptions = {
        offerToReceiveVideo : 1,
      }

      //동료 연결
      this.localPeerConnection = new RTCPeerConnection(servers);
      console.log('Created local peer connection object localPeerConnection');
      
      this.localPeerConnection.addEventListener('icecandidate',this.handleConnection);
      this.localPeerConnection.addEventListener('iceconnection state change', this.handleConnectionChange);
      
      this.remotePeerConnection = new RTCPeerConnection(servers);
      
      this.remotePeerConnection.addEventListener('ice connection state change', this.handleConnectionChange);
      this.remotePeerConnection.addEventListener('addstream', this.gotRemoteMediaStream);
      
      this.localPeerConnection.addStream(this.localStream);
      this.localPeerConnection.createOffer(offerOptions)
      .then(this.createdOffer).catch(this.setSessionDescriptionError);
    
    }

    handleConnection = (event) => {
      const peerConnection = event.target;
      const iceCandidate = event.candidate;

      if(iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = this.getOtherPeer(peerConnection);

        otherPeer.addIceCandidate(newIceCandidate)
        .then(() => {
          this.handleConnectionSuccess(peerConnection);
        }).catch((error) => {
          this.handleConnectionFailure(peerConnection, error);
        });


      }
    }

    getOtherPeer = (peerConnection) => {
      return (peerConnection === this.localPeerConnection) ?
      this.remotePeerConnection : this.localPeerConnection;
    }

    getPeerName(peerConnection){
      return(peerConnection === this.localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection'
    }

    handleConnectionChange = (event) => {
      const peerConnection = event.target;
    }

    gotRemoteMediaStream = (event) => {
      const mediaStream = event.stream;
      this.$otherCanvas.srcObject = mediaStream;
      this.remoteStream = mediaStream;
      
    }

    createdOffer = (description) => {
      this.localPeerConnection.setLocalDescription(description)
      .then(() => {
        this.setLocalDescriptionSuccess(this.localPeerConnection);
      }).catch(this.setSessionDescriptionError);

      this.remotePeerConnection.setLocalDescription(description)
      .then(() => {
        this.setRemoteDescriptionSuccess(this.remotePeerConnection);
      }).catch(this.setSessionDescriptionError);

      this.remotePeerConnection.createAnswer()
      .then(this.createdAnswer)
      .catch(this.setSessionDescriptionError);
    }

    createdAnswer = (description) => {
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

    setSessionDescriptionError = (error) => {
      console.trace(`Failed to create session description : ${error}`)
    }


  // successCallback = (stream) => {
  //   console.log("Received local stream");
  //   if(window.URL){
  //     localVideo.src = stream;
  //     localStream = stream;
  //   }
  // }

  // start = () => {
  //   console.log("Requesting local stream");

  //   navigator.getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia
  //   navigator.getUserMedia({audio : true, video : true}, this.successCallback,
  //     (error) => {
  //       console.log("navigator.getUserMedia : ", error);
  //     }
  //     ) 
  // }

  componentDidMount() {
    this.canvas = document.getElementById('myCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.entityConstructor();


    // this.timer = 0;
    // this.timerOn = false;
    // this.userFrame = 0;
    this.ctx = this.canvas.getContext('2d');
    this.startAnimation();
    window.addEventListener('keydown', this.handleKeydown);

    this.startAction();

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

  //------------------------------------    animate     ---------------------------------------

  // 동작 할 함수들
  animate = () => {
    if (this.me) {
      // this.ctx.beginPath(); // 새 경로 시작
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.backImg,0,0,this.canvas.width,this.canvas.height);

      this.me.draw();
      this.me.Jump();
      this.spawnEnemy();
      this.callAction();

      

    }
    // this.calculateUserFrame();
    // 다시 넣음으로써 한프레임 지나면 발현.
    if (this.game) this.animationFrameId = requestAnimationFrame(this.animate);
    else this.defeatEntity.draw();

  }
  //------------------------------------    animate     ---------------------------------------

  //------------------------------------    enemySummon     ---------------------------------------

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


    let enemyIndex = 0;
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

    if (enemy.y < 290) {
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
  
  //------------------------------------    keydownEvent     ---------------------------------------


  render() {

    return (
      <div>
        <canvas
          id="myCanvas"
          width={1150}
          height={500}
          style={{ display: 'block', margin: 'auto', border: '1px solid black' }}

        />
        <br/>
        <canvas
          id="otherCanvas"
          width={1150}
          height={500}
          style={{ display: 'block', margin: 'auto', border: '1px solid black' }}

        />
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
