# 3D-Racing

> **Opace open-source portfolio:** [Browse Opace 3D projects, interactive web applications, AI tools and Agent Skills](https://github.com/OpaceDigitalAgency/OpaceDigitalAgency)

Advanced 3D racing game prototype (WebGPU when available, WebGL2 fallback).

## Run

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Controls

- Drive: `WASD` / Arrow keys
- Handbrake: `Space`
- Reset: `R` (or UI button)
- Camera: `C` to cycle views (Chase, Driver, Hood, Bumper, Orbit, Top)
- Mouse: Scroll to zoom, drag to rotate (in Orbit mode)
- Gamepad: left stick steer, triggers throttle/brake, `A` reset

## Features

- Futuristic car with PBR materials and LED lighting
- 3D grass with wind animation
- Water puddles with reflections and ripples
- HDR environment lighting with atmospheric fog
- Multiple camera views
- High quality post-processing (bloom, chromatic aberration, film grain)

## Notes

- Environment lighting uses `public/env/environmentSpecular.env` (Babylon environment map).
- No backend: time trial + best lap are local-only right now.


---

## About Opace Digital Agency

This project is developed and maintained by **Opace Digital Agency**, a Birmingham-based web design and development agency specializing in modern web solutions.

### Our Services

- **Web Design & Development** - Professional, responsive websites
- **Next.js & React Development** - Modern web applications
- **Frontend Development** - Cutting-edge user interfaces
- **WordPress Development** - Custom themes and plugins
- **E-commerce Solutions** - Scalable online stores

### Get in Touch

- 🌐 Website: [opace.agency](https://opace.agency)
- 📧 Services: [Web Design & Development](https://opace.agency/services/web-design)
- 💼 GitHub: [@OpaceDigitalAgency](https://github.com/OpaceDigitalAgency)
- 📍 Location: Birmingham, UK
