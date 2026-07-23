import {Application, Assets, Container, FillGradient, Graphics, Sprite,} from "pixi.js";
import gsap from "gsap";

export class Game {
    static GAME_WIDTH = 800;
    static GAME_HEIGHT = 600;
    static LAND_HEIGHT = 100;

    app = null;
    world = null;
    land = null;
    spriteBall = null;
    isJumping = false;


    async init() {
        window.addEventListener("resize", () => {
            this.resizeCanvas();
        });

        this.app = new Application();
        await this.app.init({
            width: Game.GAME_WIDTH,
            height: Game.GAME_HEIGHT,
            background: 0x1a1a2e,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            roundPixels: true
        });
        document.body.appendChild(this.app.canvas);

        this.world = new Container()
        this.app.stage.addChild(this.world);

        const gradient = new FillGradient({
            type: 'linear',
            colorStops: [
                {offset: 0, color: '#228B22'},
                {offset: 0.3, color: '#8B4513'},
                {offset: 1, color: '#5C3317'}
            ],
        });
        this.land = new Graphics()
        this.land.rect(1, 1, Game.GAME_WIDTH, Game.LAND_HEIGHT).fill(gradient)
        this.land.position.set(0, Game.GAME_HEIGHT - Game.LAND_HEIGHT);
        this.world.addChild(this.land);

        const texture = await Assets.load('/ball.png');
        this.spriteBall = new Sprite(texture)
        this.spriteBall.anchor.set(0.5);

        const baseSize = 100 / texture.width;
        this.spriteBall.baseSize = baseSize;
        this.spriteBall.scale.set(baseSize);
        this.spriteBall.x = Game.GAME_WIDTH / 2;
        this.spriteBall.y = this.land.y - this.spriteBall.height / 2;
        this.spriteBall.eventMode = 'static'
        this.world.addChild(this.spriteBall);

        this.spriteBall.on('click', () => {
            if (this.isJumping) return;
            this.isJumping = true;

            gsap.timeline()
                .add(this.jump(Game.GAME_HEIGHT / 2, 1, 1.6))
                .add(this.jump(Game.GAME_HEIGHT / 4, 0.7, 1))
                .add(this.jump(Game.GAME_HEIGHT / 8, 0.5, 0.8))
                .to(this.spriteBall.scale, {
                    x: baseSize,
                    y: baseSize,
                    duration: 0.2
                })
                .call(() => {
                    this.isJumping = false;
                });
        });
        this.resizeCanvas();
    }

    resizeCanvas() {
        if (!this.world) return;
        const scale = Math.min(window.innerWidth / Game.GAME_WIDTH, window.innerHeight / Game.GAME_HEIGHT);
        this.app.canvas.style.width = `${Game.GAME_WIDTH * scale}px`;
        this.app.canvas.style.height = `${Game.GAME_HEIGHT * scale}px`;
        this.app.canvas.style.position = "absolute";
        this.app.canvas.style.left = `${(window.innerWidth - Game.GAME_WIDTH * scale) / 2}px`;
        this.app.canvas.style.top = `${(window.innerHeight - Game.GAME_HEIGHT * scale) / 2}px`;
    }


    jump(height, squash, time) {
        const startY = this.spriteBall.y;
        const baseSize = this.spriteBall.baseSize;

        return gsap.timeline()
            .to(this.spriteBall, {
                duration: time / 2,
                y: startY - height,
                ease: "power1.out",
            })
            // растягиваем
            .to(this.spriteBall.scale, {
                duration: time / 4 + 0.1,
                x: baseSize * (1 - 0.2 * squash),
                y: baseSize * (1 + 0.1 * squash),
                ease: "sine.inOut"
            }, "<+=0.1")
            // начальное
            .to(this.spriteBall.scale, {
                duration: time / 4,
                x: baseSize,
                y: baseSize,
                ease: "none",
            }, ">")

            .to(this.spriteBall, {
                duration: time / 2,
                y: startY,
                ease: "power1.in",
            })
            // растягиваем
            .to(this.spriteBall.scale, {
                duration: time / 4,
                x: baseSize * (1 - 0.2 * squash),
                y: baseSize * (1 + 0.1 * squash),
                ease: 'power1.inOut',
            }, "<+0.25")
            //сжимаем
            .to(this.spriteBall.scale, {
                duration: 0.08,
                x: baseSize * (1 + 0.2 * squash),
                y: baseSize * (1 - 0.1 * squash),
                ease: "power2.out",
            })

    }
}