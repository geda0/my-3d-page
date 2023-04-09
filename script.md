fix navigation controls, allow the zoom as reasonable with the scene. let me move with the right click, go around with left. animate everything for an enjoyable gameplay. enhance gameplay and performance.

CODE:
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./App.css";
import { Water } from 'three/examples/jsm/objects/Water';
import { TextureLoader } from 'three';

const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

class Agent extends THREE.Object3D {
  constructor() {
    super();

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
  }

  update(deltaTime) {
    this.position.addScaledVector(this.velocity, deltaTime);
    this.rotation.y += this.direction.y * deltaTime;
  }
}

const createTargetHelper = () => {
  const targetGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const targetMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const targetHelper = new THREE.Mesh(targetGeometry, targetMaterial);
  targetHelper.visible = false;
  return targetHelper;
};

const createLowPolyTree = () => {
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
  const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1);
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.setY(0.5);

  const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
  const leavesGeometry = new THREE.ConeGeometry(1, 2, 4);
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.setY(2);

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);
  return tree;
};

const createLowPolyCharacter = () => {
  const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
  const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.setY(1);
  const agent = new Agent();


  const headMaterial = new THREE.MeshLambertMaterial({ color: 0xf08080 });
  const headGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.setY(2.25);

  agent.add(body);
  agent.add(head);
  return agent;
};

const createLowPolySun = () => {
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  const sunGeometry = new THREE.SphereGeometry(2, 16, 16);
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(100, 100, 100);
  return sun;
};

const createLowPolyMoon = () => {
  const moonMaterial = new THREE.MeshLambertMaterial({ color: 0xbfbfbf });
  const moonGeometry = new THREE.SphereGeometry(1, 16, 16);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(-40, 60, 20);
  return moon;
};

const createLowPolyCloud = () => {
  const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const cloudGeometry = new THREE.BoxGeometry(10, 5, 5);
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(0, 30, 0);
  return cloud;
};

const randomPosition = (min, max) => {
  const x = THREE.MathUtils.randFloat(min, max);
  const z = THREE.MathUtils.randFloat(min, max);
  return new THREE.Vector3(x, 0, z);
};

const addRandomTrees = (scene, count, spread) => {
  for (let i = 0; i < count; i++) {
    const tree = createLowPolyTree();
    tree.position.copy(randomPosition(-spread / 2, spread / 2));
    tree.rotation.y = Math.random() * Math.PI * 2;
    scene.add(tree);
  }
};

const addRandomCharacters = (scene, count, spread) => {
  let leader;
  for (let i = 0; i < count; i++) {
    const character = createLowPolyCharacter();
    character.position.copy(randomPosition(-spread / 2, spread / 2));
    character.rotation.y = Math.random() * Math.PI * 2;
    scene.add(character);
    leader = leader || character;
  }
  return leader;
};

const createBuilding = () => {
  const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
  const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  return building;
};

const createRock = () => {
  const rockGeometry = new THREE.IcosahedronGeometry(Math.random() * 3 + 1);
  const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
  const rock = new THREE.Mesh(rockGeometry, rockMaterial);
  return rock;
};




const App = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const lights = [];

    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(Math.random() * 200 - 100, 5, Math.random() * 200 - 100);
      lights.push(light);
      scene.add(light);
    }


    // Camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const targetHelper = createTargetHelper();
    scene.add(targetHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.mapSize.set(2048, 2048);
    scene.add(directionalLight);

    // Ground plane
    const spread = 2000;
    const groundGeometry = new THREE.PlaneGeometry(spread, spread);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);



    // Water
    const createWater = () => {
      const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
      const water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load("textures/water.jpg", (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(4, 4);
        }),
        sunDirection: directionalLight.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
      });

      water.rotation.x = -Math.PI / 2;
      water.position.y = 5; // Adjust this value to set the water level
      return water;
    };

    scene.add(createWater());


    // Add trees, characters, sun, moon, clouds, buildings, and rocks
    addRandomTrees(scene, 1000, spread);
    const leader = addRandomCharacters(scene, 100, spread);
    scene.add(createLowPolySun());
    scene.add(createLowPolyMoon());
    scene.add(createLowPolyCloud());

    const addRandomBuildings = (scene, count, spread) => {
      for (let i = 0; i < count; i++) {
        const building = createBuilding();
        building.position.set(
          Math.random() * spread - spread / 2,
          10, // Half the building height
          Math.random() * spread - spread / 2
        );
        scene.add(building);
      }
    };
    addRandomBuildings(scene, 20, spread);

    const addRandomRocks = (scene, count, spread) => {
      for (let i = 0; i < count; i++) {
        const rock = createRock();
        rock.position.set(
          Math.random() * spread - spread / 2,
          rock.geometry.parameters.radius,
          Math.random() * spread - spread / 2
        );
        scene.add(rock);
      }
    };

    addRandomRocks(scene, 50, spread);

    // Camera setup
    const character = leader;
    camera.position.copy(character.position);
    camera.position.y += 50; // Set camera height above the character
    camera.position.z += 100; // Set initial distance from the character
    camera.lookAt(character.position.x, character.position.y + 5, character.position.z); // Look at the character's head

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true; // Disable OrbitControls to use the custom camera setup    
    controls.target.copy(character.position);
    controls.target.y += 5; // Adjust the height of the target to the character's head

    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    const clock = new THREE.Clock();
    let prevTime = 0;
    let timeAccumulator = 0;

    let dayTime = 0;

    const updateDayNightCycle = () => {
      dayTime += 0.01;
      const intensity = Math.sin(dayTime);
      directionalLight.intensity = Math.max(0.2, intensity); // Set a minimum intensity for the sun
      ambientLight.intensity = 0.5 * (1 - intensity);
    };

    const updateCameraPosition = (camera, character) => {
      const cameraOffset = new THREE.Vector3(0, 10, 20);
      const cameraTarget = new THREE.Vector3(0, 5, 0);
      const newPosition = character.position.clone().add(cameraOffset);
      camera.position.lerp(newPosition, 0.1);
      camera.lookAt(character.position.clone().add(cameraTarget));
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const currTime = clock.getElapsedTime();
      const deltaTime = currTime - prevTime;
      prevTime = currTime;
      timeAccumulator += deltaTime;

      if (timeAccumulator > 0.02) {
        // Animation and control updates
        scene.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeBoundingBox();
          }
        });

        // Update day-night cycle
        updateDayNightCycle();

        // Update camera position
        updateCameraPosition(camera, leader);

        timeAccumulator = 0;
      }

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="App" />;
};

export default App;