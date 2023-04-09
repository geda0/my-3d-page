import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./App.css";

const App = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Room
    const roomSize = 10;
    const roomMaterial = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -X
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // +X
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -Y
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // +Y
      new THREE.MeshBasicMaterial({ color: 0xff00ff }), // -Z
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // +Z
    ];
    const room = new THREE.Mesh(new THREE.BoxGeometry(roomSize, roomSize, roomSize), roomMaterial);
    room.geometry.scale(1, 1, -1); // Invert the room
    scene.add(room);

    // Objects in the room
    const objectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const objectGeometry = new THREE.SphereGeometry(0.5);
    const object = new THREE.Mesh(objectGeometry, objectMaterial);
    object.position.set(2, 0, 2);
    scene.add(object);

    // First-person perspective camera
    camera.position.set(0, 0, 0);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, -1);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = 5 * Math.PI / 6;
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
