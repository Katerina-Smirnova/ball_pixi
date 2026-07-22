import {Application, Assets, FillGradient, Graphics, Sprite} from "pixi.js";
import gsap from "gsap";

export class Game {
    async init() {
        this.app = new Application();

        await this.app.init({
            width: 800,
            height: 600,
            background: 0x1a1a2e,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });
        document.body.appendChild(this.app.canvas);
        const gradient = new FillGradient({
            type: 'linear',
            colorStops: [
                { offset: 0, color: '#228B22' },
                { offset: 0.3, color: '#8B4513' },
                { offset: 1, color: '#5C3317' }
            ],
        });

        const landHeight = 100;
        const land = new Graphics()
        land.rect(1, 1, this.app.screen.width, landHeight).fill(gradient)
        land.position.set(
            0,
            this.app.screen.height - landHeight
        );
        this.app.stage.addChild(land);

        const texture = await Assets.load('/ball.png');
        const spriteBall = new Sprite(texture)
        spriteBall.anchor.set(0.5);

        spriteBall.width = 100
        spriteBall.height = 100
        spriteBall.x = this.app.screen.width / 2;
        spriteBall.y = land.y - spriteBall.height / 2.2;
        spriteBall.eventMode = 'static'
        this.app.stage.addChild(spriteBall);

        spriteBall.on('click', () => {
            const startY = spriteBall.y;
            gsap.timeline()
                .to(spriteBall, {
                    duration: 0.5,
                    y: startY - 300,
                    ease: "power2.out"
                })
                .to(spriteBall, {
                    duration: 1,
                    y: startY,
                    ease: "bounce.out"
                })
        })
    }
}