import React, {Component} from 'react';
import {getRandomEnemyType, Entities} from './Entities.js';


class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = document.getElementById('canvas');
    this.animationFrameId = null;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.enemies = [];
    this.timer = 0;
    this.difficulty = [30, 60, 90];

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      // this.timer = 0;
      // this.timerOn = false;
      // this.userFrame = 0;
    }
    //------------------------------------    state   ---------------------------------------

    this.state = {
      game: true,
      score: 0,
      highScore: 0,

      meIsJumping: false,
      meIsJumpNow: false,
      meIsStanding: false,
      meIsResetting: false,
      jumpTimer: 0,

    }
    //------------------------------------    state     ---------------------------------------

  }

  componentDidMount() {
    this.canvas = document.getElementById('canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.startAnimation();
      window.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentWillUnmount() {
    this.stopAnimation();
    window.removeEventListener('keydown', this.handleKeydown);
    // clearInterval(this.timerInterval);
  };

  startAnimation = () => {
    if (!this.imageLoaded) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  stopAnimation = () => {
    cancelAnimationFrame(this.animationFrameId);
  }

  //------------------------------------    animate     ---------------------------------------

  // 동작 할 함수들
  animate = () => {
    this.drawMe();
    this.meJump();
    this.enemySummon();
    // this.calculateUserFrame();

    

    // 다시 넣음으로써 한프레임 지나면 발현.
    this.animationFrameId = requestAnimationFrame(this.animate);

  }
  //------------------------------------    animate     ---------------------------------------

  //------------------------------------    enemySummon     ---------------------------------------
  enemySummon = () => {
    this.timer++;
    if(this.timer % this.difficulty[1] === 0 ) {
      const enemyType = getRandomEnemyType();
      let enemy = new Entities[enemyType]();
      this.enemies.push(enemy);
    }

    this.enemies.forEach((enemyEntity, enemyIndex, o) => {
      if (enemyEntity.x < -40) o.splice(enemyIndex, 1); 
      this.isCrush(this.me, enemyEntity);

      enemyEntity.draw();
      enemyEntity.move();
    });
  }
  //------------------------------------    enemySummon      ---------------------------------------


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

  //------------------------------------    crush     ---------------------------------------

  isCrush = () => {

  }
  //------------------------------------    crush     ---------------------------------------

  //------------------------------------    keydownEvent     ---------------------------------------

  handleKeydown = (event) => {
    const jumpKey = ['Space', 'ArrowUp', 'KeyW'];
    const standKey = ['ArrowDown', 'KeyS']
    const resetKey = ['KeyR']
    const frameKey = ['KeyF']

    if (jumpKey.includes(event.code)) {
      if (!this.state.meIsJumpNow) this.setState({ meIsJumping: true, meIsStanding: false })
      if (!this.state.game) this.setState({ game: true })

    }

    if (standKey.includes(event.code)) {
      this.setState({ meIsStanding: true })
    }

    if (resetKey.includes(event.code)) {
      this.setState({ meIsResetting: true })
    }

    if (frameKey.includes(event.code)) {
      this.setState({ meIsResetting: true })
    }
  };
  //------------------------------------    keydownEvent     ---------------------------------------


  render() {
    const canvasProps = {
      ctx : this.ctx,
      canvas : this.canvas,
      startAnimation : this.startAnimation,
      handleKeydown : this.handleKeydown,
    }
    return (
      <>
        <canvas
          id="canvas"
          width={1150}
          height={500}
          style={{ display: 'block', margin: 'auto' }}
        >
          <BaseEntity {...canvasProps}/>
          <DefeatEntity {...canvasProps}/>
        </canvas>
      </>


    )

  }

};

export default Canvas;
