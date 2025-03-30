import { gsap } from "gsap";

export class Animations {
  constructor(game) {
    this.game = game;
  }

  playerHit() {
    // Анимация получения урона
    gsap.to(this.game.player.material, {
      color: 0xff0000,
      duration: 0.2,
      onComplete: () => {
        gsap.to(this.game.player.material, {
          color: 0x00aaff,
          duration: 0.5,
        });
      },
    });

    // Тряска камеры
    gsap.to(this.game.camera.position, {
      x: "+=" + (Math.random() * 0.5 - 0.25),
      y: "+=" + (Math.random() * 0.5 - 0.25),
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      onComplete: () => {
        this.game.camera.position.set(0, 0, 5);
      },
    });
  }

  showCoinCollect(position) {
    // Создаем элемент для анимации "+100"
    const coinText = document.createElement("div");
    coinText.className = "coin-collect";
    coinText.textContent = "+100";
    coinText.style.left = `${(position.x + 1) * 50}%`;
    coinText.style.top = `${(-position.y + 1) * 50}%`;
    document.getElementById("game-container").appendChild(coinText);

    // Удаляем элемент после анимации
    setTimeout(() => {
      coinText.remove();
    }, 1000);
  }
}
