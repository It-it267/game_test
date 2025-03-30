import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
  }
  
  explode(position) {
    const particleCount = 50;
    const particles = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff5555,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Позиция
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Цвет
      colors[i * 3] = 1;
      colors[i * 3 + 1] = THREE.MathUtils.randFloat(0.2, 0.8);
      colors[i * 3 + 2] = THREE.MathUtils.randFloat(0.2, 0.5);
      
      // Размер
      sizes[i] = THREE.MathUtils.randFloat(0.1, 0.3);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(particleSystem);
    
    // Анимация частиц
    const speed = 0.1;
    const animate = () => {
      const positions = particles.attributes.position.array;
      let stillActive = false;
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += (Math.random() - 0.5) * speed;
        positions[i * 3 + 1] += (Math.random() - 0.5) * speed;
        positions[i * 3 + 2] += (Math.random() - 0.5) * speed;
        
        if (Math.abs(positions[i * 3]) < 20 && 
            Math.abs(positions[i * 3 + 1]) < 20 && 
            Math.abs(positions[i * 3 + 2]) < 20) {
          stillActive = true;
        }
      }
      
      particles.attributes.position.needsUpdate = true;
      
      if (stillActive) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(particleSystem);
      }
    };
    
    animate();
  }
}
