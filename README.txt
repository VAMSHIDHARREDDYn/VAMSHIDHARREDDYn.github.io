VAMSHIDHAR PORTFOLIO

QUICK VIEW
Extract this ZIP, then open index.html in Chrome. The truck, photo, styles and website code are embedded. Fonts may use an internet connection. WebGL must be enabled for the 3D scene. Scroll to drive; drag with a mouse to orbit.

EDIT THE SOURCE
Open the source folder in your editor. Install Node.js, then run:
  npm ci
  npm run dev
Open the local address printed in the terminal.
To create the production website: npm run build

The truck is a custom Three.js model in src/truck.js; it does not require an external GLB.

WHAT CHANGED IN THIS VERSION
- Camera choreography: close three-quarter view of the cab, side tracking shot, then a wide view beside the Build / Test / Deploy list.
- Truck: glass windshield, exhaust stacks, sun visor, mud flaps, deeper red paint, soft contact shadows under tractor and trailer.
- Road: darker asphalt, brighter lane lines, a red checkpoint line and sign for each delivery stage.
- Page motion: hero text and portrait parallax, journey heading arrives after the opening close-up, project sections reveal in sequence, project visuals tilt with the pointer.
The root index.html was rebuilt from source/src without npm (the three.js build already embedded in it was reused). Running "npm run build" in source/ produces an equivalent page.

- Assembly-line stations: three portal frames over the road. Build has overhead arms working over the trailer, Test has a red scan sheet, Deploy has a boom gate that lifts as the truck arrives.
