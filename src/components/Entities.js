


class BaseEntity {
    constructor(props) {
        this.ctx = props.ctx;
        this.canvas = props.canvas;
        this.startAnimation = props.startAnimation;
        this.x = 0;
        this.y = 400;
        this.width = 50;
        this.height = 50;
        this.imgIndex = 0;
        this.frameCount = 0;
        this.imgArray = [];
        this.imageObjects = [];
        this.imageLoaded = false;
    }

    draw = () => {
        if (this.frameCount % 6 === 0) this.imgIndex++;
        if (this.imgIndex === this.imgArray.length) this.me.imgIndex = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const currentImage = this.imageObjects[this.imgIndex];
        this.ctx.drawImage(currentImage, this.x, this.y, this.width, this.height);
        this.me.frameCount++;
    }
}

//------------------------------------    me     ---------------------------------------

class Me extends BaseEntity {
    constructor(props) {
        super(props);
        this.x = 40;
        isJumpNow = false;
        isJumping = false;
        isStanding = false;
        imageLoaded = false;
        jumpTimer = 0;

        for (let i = 1; i <= 8; i++) {
            this.imgArray.push("images/happycatapple/happycatapple-" + i + ".png");
        }

        this.imgArray.forEach(src => {
            const img = new Image();
            img.src = `${process.env.PUBLIC_URL}/${src}`;
            img.onload = () => {
                console.log('Image loaded:', img.src);
                this.me.imageObjects.push(img);
                if (this.imageObjects.length === this.imgArray.length && this.canvas) {
                    // 모든 이미지 객체가 로딩되었을 때 애니메이션 시작
                    this.imageLoaded = true;
                    this.startAnimation();
                }
            };
            return img;
        });
    }
    //------------------------------------    jump     ---------------------------------------

    Jump = () => {
        if (this.isJumping && !this.isJumpNow) {
            this.y -= 3;
            this.jumpTimer += 1;
        }

        //40 이상 뛰었을 때 내려와야겠지?
        if (this.jumpTimer > 40 || this.isStanding){
            
        }this.setState({ isJumping: false, jumpTimer: 0, isJumpNow: true });


        if (!this.state.meIsJumping) {
            if (this.y <= 400) {
                this.y += 3.3;

                if (this.state.meIsStanding) this.y += 4;
                if (this.y > 398) {
                    this.y = 400;
                    this.setState({ meIsJumpNow: false });
                }
            }
        }


        //------------------------------------    jump     ---------------------------------------
    }
}



//------------------------------------    me     ---------------------------------------

//------------------------------------    enemy     ---------------------------------------

class Enemy extends BaseEntity {
    constructor(props) {
        super(props);
        this.x = 1000;
        this.imageBasePath = "";
        this.numImage = 0;
        this.imgArray = [];
        this.moveSpeed = 3;
        for (let i = 1; i <= this.numImage; i++) {
            this.imgArray.push(imageBasePath + i + ".png");
        }

        this.imgArray.forEach(src => {
            const img = new Image();
            img.src = `${process.env.PUBLIC_URL}/${src}`;
            img.onload = () => {
                console.log('Image loaded:', img.src);
                this.imageObjects.push(img);
                if (this.imageObjects.length === this.imgArray.length && this.canvas) {
                    // 모든 이미지 객체가 로딩되었을 때 애니메이션 시작
                    this.imageLoaded = true;
                    this.startAnimation();
                }
            };
            return img;
        });
    }

    move = () => {
        this.x -= this.moveSpeed;
    }
}

class BasicCat extends Enemy {
    constructor(props) {
        super(props);
        this.imageBasePath = "public/images/basic Cat-";
        this.numImage = 1;
    }

}

class MaxWellCat extends Enemy {
    constructor(props) {
        super(props);
        this.imageBasePath = "public/images/maxwell cat/maxwell cat-"
        this.numImage = 57;
    }

}

class HappyCat extends Enemy {
    constructor(props) {
        super(props);
        this.imageBasePath = "public/images/happy cat/happy cat-";
        this.numImage = 40;
    }

}

export const getRandomEnemyType = () => {
    const randomEnemyType = Math.random();
    if (randomEnemyType < 0.6) return BasicCat;
    else if (randomEnemyType < 0.9) return MaxWellCat;
    else return HappyCat;
}

//------------------------------------    enemy     ---------------------------------------


class DefeatEntity {


}

export const Entities = { Me, Enemy, BasicCat, MaxWellCat, HappyCat, DefeatEntity, }