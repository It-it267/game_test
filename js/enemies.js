import * as THREE from 'three';

export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = [];
    this.spawnInterval = 2000; // ms
    this.lastSpawnTime = 0;

    this.enemyGeometry = new THREE.ConeGeometry(0.5, 1, 8);
    this.enemyMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x880000,
      emissiveIntensity: 0.5
    });
  }

  update(playerPosition) {
    const now = Date.now();

    // Спавн новых врагов
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.spawnEnemy(playerPosition);
      this.lastSpawnTime = now;

      // Увеличиваем сложность
      this.spawnInterval = Math.max(500, this.spawnInterval - 50);
    }

    // Движение врагов
    this.enemies.forEach(enemy => {
      const direction = new THREE.Vector3().subVectors(
        enemy.mesh.position,
        playerPosition
      ).normalize();

      enemy.mesh.position.x -= direction.x * enemy.speed;
      enemy.mesh.position.y -= direction.y * enemy.speed;
      enemy.mesh.position.z -= direction.z * enemy.speed;

      enemy.mesh.rotation.x += 0.1;
      enemy.mesh.rotation.y += 0.1;
    });
  }

  spawnEnemy(playerPosition) {
    const enemy = new THREE.Mesh(this.enemyGeometry, this.enemyMaterial);

    // Позиционируем врага за пределами экрана
    const angle = Math.random() * Math.PI * 2;
    const radius = 15 + Math.random() * 5;

    enemy.position.x = Math.cos(angle) * radius;
    enemy.position.y = (Math.random() - 0.5) * 10;
    enemy.position.z = playerPosition.z - 20 - Math.random() * 10;

    enemy.speed = 0.03 + Math.random() * 0.02;

    this.scene.add(enemy);
    this.enemies.push({ mesh: enemy, speed: enemy.speed });
  }

  removeEnemy(enemy) {
    this.scene.remove(enemy.mesh);
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
  }

  clear() {
    this.enemies.forEach(enemy => this.scene.remove(enemy.mesh));
    this.enemies = [];
    this.spawnInterval = 2000;
    this.lastSpawnTime = 0;
  }
}
