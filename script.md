make ir first person view. create a big room and keep me from being able to cross the walls, ceiling, or floors, which are all painted different suble colors.
add objects in the room and make it feel like reality
let me start in the middle of it and add vanigation options.

here is a good starting point: use docker and docker-compose:

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
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

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={containerRef} className="container"></div>;
};

export default App;

body {
    margin: 0;
    overflow: hidden;
  }