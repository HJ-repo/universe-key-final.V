import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

class App {
  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this._divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    this._scene = scene;

    this._rotation = { x: 0, y: 0 };
    this._isDragging = false;
    this._previousMousePosition = { x: 0, y: 0 };

    this._setupCamera();
    this._setupLights();
    this._setupModel();

    // 마우스 회전 관련
    this._isDragging = false;
    this._previousMousePosition = { x: 0, y: 0 };
    this._rotation = { x: 0, y: 0 };

    divContainer.addEventListener("mousedown", this._onMouseDown.bind(this));
    divContainer.addEventListener("mousemove", this._onMouseMove.bind(this));
    divContainer.addEventListener("mouseup", this._onMouseUp.bind(this));
    divContainer.addEventListener("mouseleave", this._onMouseUp.bind(this));

    // 터치 회전 관련
    divContainer.addEventListener("touchstart", this._onTouchStart.bind(this));
    divContainer.addEventListener("touchmove", this._onTouchMove.bind(this));
    divContainer.addEventListener("touchend", this._onTouchEnd.bind(this));

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    this._camera = camera;


    this._rotation.y = 0;
    this._rotation.x = Math.atan2(1.5, 3.5);
    this._updateCameraPosition();
  }

  _updateCameraPosition() {
    const radius = 3.5;
    const x = radius * Math.sin(this._rotation.y) * Math.cos(this._rotation.x);
    const y = radius * Math.sin(this._rotation.x);
    const z = radius * Math.cos(this._rotation.y) * Math.cos(this._rotation.x);
    this._camera.position.set(x, y, z);
    this._camera.lookAt(0, 0, 0);
  }

  _setupLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    this._scene.add(light);
  }

  _setupModel() {
    const geometry = new THREE.BufferGeometry();
    const numParticles = 10000;
    const positions = [];

    for (let i = 0; i < numParticles; i++) {
      const radius = Math.random() * 2;
      const angle = Math.random() * Math.PI * 4;
      const spiral = radius * 0.5;

      const x = Math.cos(angle + spiral) * radius;
      const y = (Math.random() - 0.5) * 0.3;
      const z = Math.sin(angle + spiral) * radius;

      positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.01,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    this._scene.add(particles);
    this._particles = particles;

    this._imageGroup = new THREE.Group();
    this._scene.add(this._imageGroup);

    const loader = new THREE.ImageLoader();
    const userImageData = localStorage.getItem("userImage");

    const imagePaths = [
      userImageData
    ];

    imagePaths.forEach((path, index) => {
      loader.load(path, (image) => {
        const isUserImage = path === userImageData;
        const size = isUserImage ? 0.34 : 0.4;
        const texture = this._createRoundedTexture(image);

        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        const angle = (index / imagePaths.length) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        mesh.position.set(x, 0, z);
        this._imageGroup.add(mesh);
      });
    });
  }

  _createRoundedTexture(image, radius = 30) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(image, 0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  _onMouseDown(event) {
    this._isDragging = true;
    this._previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  _onMouseMove(event) {
    if (!this._isDragging) return;
    const deltaX = event.clientX - this._previousMousePosition.x;
    const deltaY = event.clientY - this._previousMousePosition.y;

    this._rotation.y -= deltaX * 0.005;
    this._rotation.x += deltaY * 0.005;

    this._rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this._rotation.x));
    this._updateCameraPosition();

    this._previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  _onMouseUp() {
    this._isDragging = false;
  }

  _onTouchStart(event) {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this._isDragging = true;
      this._previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }
  }

  _onTouchMove(event) {
    if (!this._isDragging || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - this._previousMousePosition.x;
    const deltaY = touch.clientY - this._previousMousePosition.y;

    this._rotation.y -= deltaX * 0.005;
    this._rotation.x += deltaY * 0.005;

    this._rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this._rotation.x));
    this._updateCameraPosition();

    this._previousMousePosition = { x: touch.clientX, y: touch.clientY };
  }

  _onTouchEnd() {
    this._isDragging = false;
  }

  resize() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  render(time) {
    this._renderer.render(this._scene, this._camera);
    this.update(time * 0.001);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    if (this._particles) {
      this._particles.rotation.y = time * 0.1;
    }

    if (this._imageGroup) {
      this._imageGroup.rotation.y = time * 0.5;
      this._imageGroup.children.forEach((mesh) => {
        mesh.rotation.y = time * 1.0;
      });
    }
  }
}

export default App;