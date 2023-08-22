// import { Component } from "react";

class BaseEntity {
    constructor(CanvasProps) {
        this.ctx = CanvasProps.ctx;
        this.canvasWidth = CanvasProps.canvasWidth;
        this.canvasHeight = CanvasProps.canvasHeight;
        this.startAnimation = CanvasProps.startAnimation;
        // this.startAnimation = startAnimation;
        // console.log(startAnimation);

        // this.canvas = canvasProps.canvas;
        // this.startAnimation = canvasProps.startAnimation;
        // this.canvasWidth = canvasProps.canvasWidth;
        // this.canvasHeight = canvasProps.canvasHeight;

        this.x = 0;
        this.y = 290;
        this.width = 55;
        this.height = 55;
        this.imageBasePath = "";
        this.numImage = 0;

        this.drawX = 0;
        this.drawY = 0;
        this.drawWidth = 0;
        this.drawHeight = 0;

        this.imgIndex = 0;
        this.frameCount = 0;
        this.imgArray = [];
        this.imageObjects = [];
        this.imageLoaded = false;
        this.imageConvertSpeed = 6;


    }


    imageLoad = () => {
        for (let i = 1; i <= this.numImage; i++) {
            this.imgArray[i - 1] = (this.imageBasePath + i + ".png");
        }
        // console.log(this.imgArray);

        this.imgArray.forEach(src => {
            const img = new Image();
            // img.src = src;
            img.src = `${process.env.PUBLIC_URL}/${src}`;
            // console.log(img.src);

            img.onload = () => {
                // console.log('Image loaded:', img.src);
                this.imageObjects.push(img);
                if (this.imageObjects.length === this.imgArray.length && this.ctx) {
                    this.imageLoaded = true;
                    console.log('loading Complete', this);

                }
            };

            img.onerror = () => console.log(img.src, "img loading error")
            return img;
        });
        if (this.imageLoaded) return true;
        else return false;
    }

    draw = () => {
        if (this.imageLoaded && this.ctx) {

            // this.ctx.beginPath(); // 새 경로 시작
            if (this.frameCount % this.imageConvertSpeed === 0) this.imgIndex++;
            if (this.imgIndex === this.imgArray.length) this.imgIndex = 0;
            // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            // console.log(this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight));
            const currentImage = this.imageObjects[this.imgIndex];
            // this.ctx.fillRect(this.x, this.y, this.width, this.height); // hit box
            this.ctx.drawImage(currentImage, this.x, this.y, this.width, this.height);
            this.frameCount++;
            return true;

        }
        else return false;
    }
};

//------------------------------------    me     ---------------------------------------

class Me extends BaseEntity {
    constructor(CanvasProps) {
        super(CanvasProps);
        this.x = 40;
        this.isJumpNow = false;
        this.isJumping = false;
        this.isStanding = false;
        this.imageLoaded = false;
        this.jumpTimer = 0;

        this.numImage = 8;
        this.imageBasePath = "images/happycatapple/happycatapple-";


    }

    //------------------------------------    jump     ---------------------------------------

    Jump = () => {
        if (this.isJumping && !this.isJumpNow) {
            this.y -= 3.2;
            this.jumpTimer += 1;
        }

        //40 이상 뛰었을 때 내려와야겠지?
        if (this.jumpTimer > 40 || this.isStanding) {
            this.isJumpNow = true;
            this.isJumping = false;
            this.jumpTimer = 0;
        }

        if (!this.isJumping || this.isJumpNow) {
            if (this.y <= 290) {
                this.y += 3.5;

                if (this.isStanding) this.y += 4;
                if (this.y > 288) {
                    this.y = 290;
                    this.isJumpNow = false;
                }
            }
        }
    }
    //------------------------------------    jump     ---------------------------------------
}



//------------------------------------    me     ---------------------------------------

//------------------------------------    enemy     ---------------------------------------

class Enemy extends BaseEntity {
    constructor(CanvasProps) {
        super(CanvasProps);
        this.x = 1400;
        this.moveSpeed = 3;
    }

    move = () => {
        this.x -= this.moveSpeed;
    }
}

class BasicCat extends Enemy {
    constructor(CanvasProps) {
        super(CanvasProps);
        this.imageBasePath = "images/basic Cat-";
        this.numImage = 1;
        // this.width = 60;
        // this.height = 60;
    }
}

class MaxWellCat extends Enemy {
    constructor(CanvasProps) {
        super(CanvasProps);
        this.imageBasePath = "images/maxwell cat/maxwell cat-"
        this.numImage = 57;
        this.imageConvertSpeed = 4;
    }



    move = () => {
        this.x -= this.moveSpeed;
        if (this.x <= 150) this.y -= 3;
    }

}

class HappyCat extends Enemy {
    constructor(CanvasProps) {
        super(CanvasProps);
        this.imageBasePath = "images/happy cat/happy cat-";
        this.numImage = 40;
        this.width = 60;
        this.height = 60;
        this.jumpTimer = 0;
        this.jumpSwitch = true;
    }

    move = () => {
        this.x -= this.moveSpeed;
        this.jumpTimer++;
        if (this.x > 110) {
            if (this.jumpTimer % 30 === 0) this.jumpSwitch = !this.jumpSwitch;
            if (this.jumpSwitch) this.y -= 5;
            else this.y += 5;
        }
        else this.y = 290;

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
    constructor(CanvasProps) {
        this.ctx = CanvasProps.ctx;
        this.canvasWidth = CanvasProps.canvasWidth;
        this.canvasHeight = CanvasProps.canvasHeight;

        this.x = 0;
        this.y = 0;
        this.width = this.canvasWidth;
        this.height = this.canvasHeight;
    }

    draw() {
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.restore();

        this.ctx.font = "200px serif";
        this.ctx.fillStyle = "#000000";
        this.ctx.textAlign = "center";
        this.ctx.fillText("DEFEAT", this.canvasWidth / 2, this.canvasHeight / 2);

        this.ctx.font = "40px serif"
        this.ctx.fillText("press w, up, space", this.canvasWidth / 2, this.canvasHeight / 2 + 70);
        // $score.scoreWidth = $canvas.width/2



    }


}



export const Entities = { BaseEntity, Me, Enemy, BasicCat, MaxWellCat, HappyCat, DefeatEntity, }