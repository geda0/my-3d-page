import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  for (let i = 0; i < count; i++) {
    const character = createLowPolyCharacter();
    character.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
    character.rotation.y = Math.random() * Math.PI * 2;
    scene.add(character);
  }
};


const App = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-50 * aspect, 50 * aspect, 50, -50, 1, 2000);

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
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add trees
    addRandomTrees(scene, 100);

    // Add characters
    addRandomCharacters(scene, 10);

    // Camera setup
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true; // Enable panning in screen space
    controls.minDistance = 50;
    controls.maxDistance = 200;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={containerRef} className="container"></div>;
};

export default App;
