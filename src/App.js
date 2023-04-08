import React, { useEffect } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById("container");
    container.appendChild(renderer.domElement);

    // Create materials for each face of the room
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide }), // Left wall (red)
      new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide }), // Right wall (green)
      new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.BackSide }), // Ceiling (yellow)
      new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.BackSide }), // Floor (magenta)
      new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.BackSide }), // Back wall (cyan)
      new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.BackSide })  // Front wall (orange)
    ];

    // Create the room with multiple materials, making the room 10x larger
    const roomSize = 2000;
    const roomGeometry = new THREE.BoxGeometry(roomSize, roomSize, roomSize);
    const room = new THREE.Mesh(roomGeometry, materials);
    scene.add(room);

    // Set up Raycaster for collision detection
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();

    const isColliding = (direction) => {
      raycaster.set(camera.position, direction.normalize());
      const intersects = raycaster.intersectObject(room);
      return intersects.length > 0 && intersects[0].distance < 1;
    };

    camera.position.z = 250;
    camera.position.y = 0;

    const controls = new PointerLockControls(camera, renderer.domElement);
    document.addEventListener("click", () => {
      controls.lock();
    });

    const onKeyDown = (event) => {
      let move = false;
      direction.set(0, 0, 0);
      switch (event.code) {
        case "KeyW":
          direction.z = -1;
          move = true;
          break;
        case "KeyS":
          direction.z = 1;
          move = true;
          break;
        case "KeyA":
          direction.x = -1;
          move = true;
          break;
        case "KeyD":
          direction.x = 1;
          move = true;
          break;
      }

      if (move && !isColliding(direction)) {
        controls.moveForward(direction.z * 0.1);
        controls.moveRight(direction.x * 0.1);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Add click event listener
    container.addEventListener("click", function () {
      if (document.pointerLockElement !== container) {
        container.requestPointerLock();
      }
    });

    return () => {
      container.removeChild(renderer.domElement);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return <div id="container" style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }} />;
}

export default App;