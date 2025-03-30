import * as THREE from 'three';
import { EnemyManager } from './enemies.js';
import { ParticleSystem } from './particles.js';
import { Animations } from './animations.js';

export class Game {
  constructor() {
    this.score = 0;
    this.coins = 0;
    this.health = 100;
    this.isRunning = false;
    
    this.initScene();
    this.initLights();
    this.initPlayer();
    this.initEnemies();
    this.initCoins();
    this.initParticles();
    
    this.animations = new Animations(this);
    
    this.keys = {};
    document.addEventListener('keydown', (e) => this.keys[e.code] = true);
    document.addEventListener('keyup', (e) => this.keys[e.code] = false);
  }
  
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000033);
    
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').prepend(this.renderer.domElement);
    
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  initLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Создаем звездное небо
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      starsVertices.push(
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000),
        THREE.MathUtils.randFloatSpread(2000)
      );
    }
    
    starsGeometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(starField);
  }
  
  initPlayer() {
    this.player = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ 
        color: 0x00aaff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5
      })
    );
    this.scene.add(this.player);
    
    // Добавляем эффект свечения
    const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5
    });
    this.playerGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.player.add(this.playerGlow);
  }
  
  initEnemies() {
    this.enemyManager = new EnemyManager(this.scene);
  }
  
  initCoins() {
    this.coins = [];
    this.coinGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    this.coinMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      emissive: 0xaa9900,
      emissiveIntensity: 0.5
    });
    
    // Создаем несколько монет
    for (let i = 0; i < 10; i++) {
      this.spawnCoin();
    }
  }
  
  spawnCoin() {
    const coin = new THREE.Mesh(this.coinGeometry, this.coinMaterial);
    
    coin.position.x = THREE.MathUtils.randFloatSpread(20);
    coin.position.y = THREE.MathUtils.randFloatSpread(10);
    coin.position.z = THREE.MathUtils.randFloatSpread(20) - 15;
    
    coin.rotationSpeed = THREE.MathUtils.randFloat(0.01, 0.05);
    coin.userData.isCoin = true;
    
    this.scene.add(coin);
    this.coins.push(coin);
  }
  
  initParticles() {
    this.particleSystem = new ParticleSystem(this.scene);
  }
  
  start() {
    this.isRunning = true;
    this.score = 0;
    this.coins = 0;
    this.health = 100;
    this.updateUI();
    this.gameLoop();
  }
  
  gameLoop() {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.gameLoop());
    
    this.updatePlayer();
    this.updateEnemies();
    this.updateCoins();
    this.checkCollisions();
    
    this.renderer.render(this.scene, this.camera);
  }
  
  updatePlayer() {
    const speed = 0.1;
    
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.player.position.y += speed;
    }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      this.player.position.y -= speed;
    }
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.position.x -= speed;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.position.x += speed;
    }
    
    // Ограничиваем движение игрока
    this.player.position.x = THREE.MathUtils.clamp(
      this.player.position.x, 
      -8, 
      8
    );
    this.player.position.y = THREE.MathUtils.clamp(
      this.player.position.y, 
      -4, 
      4
    );
    
    // Анимация свечения игрока
    this.playerGlow.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    this.playerGlow.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    this.playerGlow.scale.z = 1 + Math.sin(Date.now() * 0.005) * 0.2;
  }
  
  updateEnemies() {
    this.enemyManager.update(this.player.position);
  }
  
  updateCoins() {
    this.coins.forEach(coin => {
      coin.rotation.y += coin.rotationSpeed;
      
      // Парящая анимация
      coin.position.y += Math.sin(Date.now() * 0.002) * 0.01;
    });
  }
  
  checkCollisions() {
    // Проверка столкновений с врагами
    const playerBox = new THREE.Box3().setFromObject(this.player);
    
    this.enemyManager.enemies.forEach(enemy => {
      const enemyBox = new THREE.Box3().setFromObject(enemy.mesh);
      
      if (playerBox.intersectsBox(enemyBox)) {
        this.takeDamage(10);
        this.enemyManager.removeEnemy(enemy);
        this.particleSystem.explode(enemy.mesh.position);
      }
    });
    
    // Проверка сбора монет
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      const coinBox = new THREE.Box3().setFromObject(coin);
      
      if (playerBox.intersectsBox(coinBox)) {
        this.collectCoin(coin, i);
      }
    }
  }
  
  collectCoin(coin, index) {
    this.score += 100;
    this.coins += 1;
    this.updateUI();
    
    // Анимация сбора монеты
    this.animations.showCoinCollect(coin.position);
    this.scene.remove(coin);
    this.coins.splice(index, 1);
    
    // Создаем новую монету
    setTimeout(() => this.spawnCoin(), 2000);
  }
  
  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    this.updateUI();
    
    if (this.health <= 0) {
      this.gameOver();
    } else {
      // Анимация получения урона
      this.animations.playerHit();
    }
  }
  
  updateUI() {
    document.getElementById('score').querySelector('span').textContent = this.score;
    document.getElementById('coins').querySelector('span').textContent = this.coins;
    document.getElementById('health').querySelector('span').textContent = this.health;
  }
  
  gameOver() {
    this.isRunning = false;
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-coins').textContent = this.coins;
    document.getElementById('game-over').classList.remove('hidden');
  }
  
  restart() {
    // Очищаем сцену
    this.enemyManager.clear();
    this.coins.forEach(coin => this.scene.remove(coin));
    this.coins = [];
    
    // Сбрасываем позицию игрока
    this.player.position.set(0, 0, 0);
    
    // Запускаем игру заново
    this.start();
  }
}
