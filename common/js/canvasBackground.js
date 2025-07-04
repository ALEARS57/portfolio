(() => {
  const canvas = document.querySelector('#backgroundCanvas');
  if (!canvas) return;

  const canvasSizes = {
    width: window.innerWidth,
    height: window.innerHeight * 0.8
  };

  const scene = new THREE.Scene();

  let mesh;

  function createPlane(camera, scene) {
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }

    const aspectRatio = canvasSizes.width / canvasSizes.height;
    const geometry = new THREE.PlaneGeometry(2 * aspectRatio, 2, 128, 128);

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectPosition = projectionMatrix * viewPosition;

          gl_Position = projectPosition;
          vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPNoiseStrength;
        uniform float uPNoiseSize;
        uniform float uPNoiseSpeed;

        vec4 permute(vec4 x) {
          return mod(((x * 34.0) + 1.0) * x, 289.0);
        }

        vec2 fade(vec2 t) {
          return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        float cnoise(vec2 P) {
          vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
          vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
          Pi = mod(Pi, 289.0);
          vec4 ix = Pi.xzxz;
          vec4 iy = Pi.yyww;
          vec4 fx = Pf.xzxz;
          vec4 fy = Pf.yyww;
          vec4 i = permute(permute(ix) + iy);
          vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
          vec4 gy = abs(gx) - 0.5;
          vec4 tx = floor(gx + 0.5);
          gx = gx - tx;
          vec2 g00 = vec2(gx.x, gy.x);
          vec2 g10 = vec2(gx.y, gy.y);
          vec2 g01 = vec2(gx.z, gy.z);
          vec2 g11 = vec2(gx.w, gy.w);
          vec4 norm = 1.79284291400159 - 0.85373472095314 *
                      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
          g00 *= norm.x;
          g01 *= norm.y;
          g10 *= norm.z;
          g11 *= norm.w;
          float n00 = dot(g00, vec2(fx.x, fy.x));
          float n10 = dot(g10, vec2(fx.y, fy.y));
          float n01 = dot(g01, vec2(fx.z, fy.z));
          float n11 = dot(g11, vec2(fx.w, fy.w));
          vec2 fade_xy = fade(Pf.xy);
          vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
          float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
          return 2.3 * n_xy;
        }

        void main() {
          float dist = distance(vUv, uMouse);
          float dissolveFactor = smoothstep(0.05, 0.15, dist);
          float noiseValue = cnoise(vUv * uPNoiseSize + uTime * uPNoiseSpeed)
                             * uPNoiseStrength * dissolveFactor;

          vec3 darkGrey = vec3(0.1, 0.1, 0.1);
          float strength = step(0.9, sin(noiseValue));
          strength = clamp(strength, 0.0, 1.0);
          vec3 backgroundColor = vec3(0.0);
          vec3 mixedColor = mix(backgroundColor, darkGrey, strength);

          gl_FragColor = vec4(mixedColor, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPNoiseStrength: { value: 20.0 },
        uPNoiseSize: { value: 10.0 },
        uPNoiseSpeed: { value: 1.0 }
      }
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }

  const aspectRatio = canvasSizes.width / canvasSizes.height;
  const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 1);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(canvasSizes.width, canvasSizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  createPlane(camera, scene);

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    mesh.material.uniforms.uTime.value = elapsedTime * 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  const mouse = new THREE.Vector2(0.5, 0.5);
  document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth;
    mouse.y = 1 - (event.clientY / window.innerHeight);
    mesh.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
  });

  function resize() {
    canvasSizes.width = window.innerWidth;
    canvasSizes.height = window.innerHeight * 0.8;

    const newAspectRatio = canvasSizes.width / canvasSizes.height;
    camera.left = -newAspectRatio;
    camera.right = newAspectRatio;
    camera.updateProjectionMatrix();

    renderer.setSize(canvasSizes.width, canvasSizes.height);
    createPlane(camera, scene);
  }

  window.addEventListener('resize', resize);
})();
