# The Keshav Museum

A first interactive 3D museum prototype for Keshav's birthday.

## Run it
This is a static website using Three.js as an ES module from jsDelivr. Because browsers restrict module loading from `file://`, run it through a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages
1. Create or open the repository.
2. Upload the contents of this folder (not the outer ZIP folder).
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site.

## Controls
- WASD / arrow keys: move
- Mouse: look around (click the scene to lock pointer)
- Escape: pause / release mouse
- Directory: jump to any room
- Sound: toggle a soft synthesized ambient drone

## Included in this prototype
- Museum entrance with opening double doors
- Central hall and three connected galleries
- Correspondence room with 11 clickable letter exhibits
- Portrait gallery with 25 clickable frames
- Archive with five clickable collections
- Directory navigation and return paths
- Placeholder exhibit content, ready to replace

## Personal content
Replace the placeholders in `script.js` when the letters, author photos, portraits and captions are ready. Put supplied files in `assets/letters/` and `assets/portraits/`.

## Notes
This is the first functional visual prototype, not the final photorealistic art pass. The rooms are built from 3D geometry and warm museum lighting. Supplied photographs and final audio can be integrated in the next pass.
