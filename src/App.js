import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";
import { TextureLoader } from "three";
import { Howl } from "howler";
import "./App.css";

const createLowPolyTree = () => {
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1);
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.setY(0.5);

  const leavesMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
  const leavesGeometry = new THREE.ConeGeometry(1, 2, 4);
  const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
  leaves.position.setY(2);

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);
  return tree;
};

const createLowPolyCharacter = () => {
  const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 });
  const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.setY(1);

  const headMaterial = new THREE.MeshBasicMaterial({ color: 0xf08080 });
  const headGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.setY(2.25);

  const character = new THREE.Group();
  character.add(body);
  character.add(head);
  return character;
};


const createLowPolySun = () => {
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
  const sunGeometry = new THREE.SphereGeometry(2, 16, 16);
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(40, 60, 20);
  return sun;
};

const createLowPolyMoon = () => {
  const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xbfbfbf });
  const moonGeometry = new THREE.SphereGeometry(1, 16, 16);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(-40, 60, 20);
  return moon;
};

const createLowPolyCloud = () => {
  const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cloudGeometry = new THREE.BoxGeometry(10, 5, 5);
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(0, 30, 0);
  return cloud;
};

const addRandomTrees = (scene, count) => {
  for (let i = 0; i < count; i++) {
    const tree = createLowPolyTree();
    tree.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
    tree.rotation.y = Math.random() * Math.PI * 2;
    scene.add(tree);
  }
};

const addRandomCharacters = (scene, count) => {
  let leader;
  for (let i = 0; i < count; i++) {
    const character = createLowPolyCharacter();
    character.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
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

    // Camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(75, 50, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Ground plane
    const spread = 1000;
    const groundGeometry = new THREE.PlaneGeometry(spread, spread);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

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
    camera.position.y += 15; // Set camera height above the character
    camera.lookAt(character.position.x, character.position.y + 5, character.position.z); // Look at the character's head
    camera.position.x += 10; // Move camera behind the character
    camera.position.z += 10;  // Move camera behind the character


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    // controls.enableDamping = true; // Animates the camera movement
    // controls.screenSpacePanning = true; // Enable panning in screen space
    // controls.minDistance = 50;
    // controls.maxDistance = 200;
    // controls.minPolarAngle = Math.PI / 4;
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.target.copy(character.position);
    controls.update();

    const skyboxMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    // Skybox
    const createSkybox = () => {
      const skyboxSize = 50000;
      const skyboxGeometry = new THREE.BoxGeometry(skyboxSize, skyboxSize, skyboxSize);
      const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
      return skybox;
    };
    scene.add(createSkybox());

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

    // Ambient sound
    const ambientSound = new Howl({
      src: ["path/to/ambient_sound.mp3"],
      autoplay: true,
      loop: true,
      volume: 0.5,
    });

    let dayTime = 0;

    const updateDayNightCycle = () => {
      dayTime += 0.001;
      const intensity = (Math.sin(dayTime * 2 * Math.PI) + 1) / 2;
      directionalLight.intensity = intensity;
      ambientLight.intensity = 0.5 * (1 - intensity);
      skyboxMaterial.color.setHSL(0.6, 1, 0.6 + 0.4 * intensity);
    };    

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Animate trees
      scene.traverse((child) => {

        if (child.type === "Group" && child.children.length === 2) {
          // Add your tree animation logic here
        }
      });

      // Animate characters
      scene.traverse((child) => {
        if (child.type === "Group" && child.children.length === 2) {
          // Add your character animation logic here
        }
      });

      // Day-night cycle
      dayTime += 0.001;
      if (dayTime >= 1) dayTime = 0;
      updateDayNightCycle(scene, dayTime);

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={containerRef} className="container"></div>;
};

export default App;
