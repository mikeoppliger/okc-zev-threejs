# Three.js Model Viewer

A clean, modern 3D model viewer built with Three.js. Features a white environment with professional lighting setup and intuitive controls.

## Features
- Clean white environment with professional lighting setup
- Advanced material controls with real-time updates
- Orbit controls with smart camera restrictions
- Shadow support with high-quality soft shadows
- Responsive design (handles window resizing)
- No build tools required (uses ES6 modules with import maps)

## Technologies Used
- Three.js for 3D rendering
- dat.GUI for control interface
- GLTFLoader for model loading
- OrbitControls for camera manipulation

## Setup and Running
1. Clone the repository
2. Due to browser security restrictions, serve the files through a local web server:
   ```bash
   # Using Python
   python -m http.server

   # Or using Node.js
   npx http-server
   ```
3. Open your browser and navigate to `http://localhost:8000`

## Controls
- Left click + drag: Orbit around the model
- Scroll wheel: Zoom in/out
- Right click + drag: Pan

## GUI Controls
### Lighting
- Ambient Light: Overall scene brightness
- Main Light: Primary directional light intensity
- Fill Light: Secondary light for shadow softening
- Top Light: Overhead illumination

### Materials
- Color: Change model color
- Metalness: Adjust material metallic properties
- Roughness: Control surface roughness
- Wireframe: Toggle wireframe view

### Model
- Scale: Adjust model size
- Rotation: Control model orientation

## Project Structure
```
├── index.html      # Main HTML file with import maps
├── main.js         # Core application logic
├── style.css       # Basic styling
└── assets/         # 3D models and textures
```

## License
MIT
