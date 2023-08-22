// canvas.js

class BaseEntity {
    constructor(ctx, canvasWidth, canvasHeight) {
        // 이전 내용은 그대로 유지
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = 100;
        this.y = 100;
        this.width = 50;
        this.height = 50;
    }

    draw() {
        // 기본적인 그리기 로직을 여기에 추가
    }
}

class CustomEntity extends BaseEntity {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight);
        // 여기에 필요한 추가 속성과 초기화 코드를 작성
    }

    draw() {
        super.draw(); // BaseEntity의 draw() 메서드 호출
        // BaseEntity의 기본 그리기 로직을 먼저 수행

        // 새로운 그리기 로직 추가
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// 다른 하위 클래스들도 동일한 방식으로 정의할 수 있음

export { BaseEntity, CustomEntity };