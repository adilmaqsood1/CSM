// 3D Animation for Hero Section using Three.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the hero-animation container exists
    const container = document.getElementById('hero-animation');
    if (!container) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Configure renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a group to hold all objects
    const group = new THREE.Group();
    scene.add(group);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Fire & Ice colors
    const begoniaColor = new THREE.Color(0xFD7272); // Begonia
    const skyBlueColor = new THREE.Color(0x6AE1F0); // Sky Blue
    
    // Create wave particles
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particles with random positions and colors
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Position in a sphere
        const radius = 15 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Interpolate between begonia and sky blue
        const mixRatio = Math.random();
        const color = new THREE.Color().lerpColors(begoniaColor, skyBlueColor, mixRatio);
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
        
        // Random sizes
        sizes[i] = Math.random() * 2 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Create floating cubes representing data or customer interactions
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterials = [
        new THREE.MeshPhongMaterial({ color: 0xFD7272, flatShading: true, transparent: true, opacity: 0.8 }), // Begonia
        new THREE.MeshPhongMaterial({ color: 0x6AE1F0, flatShading: true, transparent: true, opacity: 0.8 }), // Sky Blue
        new THREE.MeshPhongMaterial({ color: 0x4F46E5, flatShading: true, transparent: true, opacity: 0.8 })  // Indigo
    ];

    // Create multiple cubes
    const cubes = [];
    for (let i = 0; i < 10; i++) {
        const material = cubeMaterials[Math.floor(Math.random() * cubeMaterials.length)];
        const cube = new THREE.Mesh(cubeGeometry, material);
        
        // Random positions
        cube.position.x = (Math.random() - 0.5) * 15;
        cube.position.y = (Math.random() - 0.5) * 15;
        cube.position.z = (Math.random() - 0.5) * 15 - 5; // Push back a bit
        
        // Random rotation
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        // Random scale
        const scale = Math.random() * 0.5 + 0.1;
        cube.scale.set(scale, scale, scale);
        
        // Add to scene and tracking array
        group.add(cube);
        cubes.push({
            mesh: cube,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: (Math.random() - 0.5) * 0.01
        });
    }

    // Position camera
    camera.position.z = 15;

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation loop
    let time = 0;
    function animate() {
        time += 0.01;
        requestAnimationFrame(animate);
        
        // Rotate the entire group slowly
        group.rotation.y += 0.003;
        
        // Animate each cube individually
        cubes.forEach(cube => {
            // Rotate each cube
            cube.mesh.rotation.x += cube.rotationSpeed.x;
            cube.mesh.rotation.y += cube.rotationSpeed.y;
            
            // Float up and down
            cube.mesh.position.y += cube.floatSpeed;
            if (Math.abs(cube.mesh.position.y) > 5) {
                cube.floatSpeed = -cube.floatSpeed;
            }
        });
        
        // Animate wave particles
        const positions = particleSystem.geometry.attributes.position.array;
        const colors = particleSystem.geometry.attributes.color.array;
        const sizes = particleSystem.geometry.attributes.size.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Create wave motion
            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];
            
            // Calculate distance from center for wave effect
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            // Wave animation based on distance and time
            const waveAmplitude = 0.2;
            const waveFrequency = 0.5;
            const waveFactor = Math.sin(distance * waveFrequency - time) * waveAmplitude;
            
            // Apply wave effect to particle positions
            const normalizedX = x / distance;
            const normalizedY = y / distance;
            const normalizedZ = z / distance;
            
            positions[i3] = x + normalizedX * waveFactor;
            positions[i3 + 1] = y + normalizedY * waveFactor;
            positions[i3 + 2] = z + normalizedZ * waveFactor;
            
            // Pulse size based on time
            sizes[i] = (Math.sin(time + i * 0.1) * 0.5 + 1.5) * (Math.random() * 0.5 + 0.5);
            
            // Shift colors over time for subtle color transitions
            const mixRatio = (Math.sin(time * 0.2 + i * 0.05) * 0.5 + 0.5);
            const color = new THREE.Color().lerpColors(begoniaColor, skyBlueColor, mixRatio);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        // Update particle attributes
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
        particleSystem.geometry.attributes.size.needsUpdate = true;
        
        // Rotate particle system
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.z += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
});