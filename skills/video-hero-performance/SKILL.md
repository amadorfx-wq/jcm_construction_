---
name: Video Hero Performance (WebKit Defensive Architecture)
description: Arquitectura defensiva completa para componentes VideoHero con video de fondo en Next.js. Cubre: Low Power Mode iOS, race conditions React, supresión Shadow DOM WebKit, opacidades anti-velo-negro. Invocar cuando se construya cualquier hero con video de fondo en Safari/iOS.
---

# Video Hero Performance — WebKit Defensive Architecture

Forjado en batalla durante el proyecto JC Milian Construction. Estos patrones resuelven los 5 problemas que iOS Safari introduce en un `<video>` de fondo autoreproducible.

---

## LECCIÓN 1 — La Mentira de iOS: No confíes en `.catch()` de `play()`

### El problema
En iOS 15+, `video.play()` con Low Power Mode activo puede **resolver el promise** (`.then()`) sin lanzar un rechazo, pero el video nunca decodifica frames reales. `onCanPlay` no dispara jamás. El browser "acepta" la orden de reproducción pero la ignora silenciosamente.

### La solución: Watchdog Timer de 4 segundos

Si `onCanPlay` no dispara en 4000ms, el video está bloqueado. Activar degradación elegante.

```typescript
const canPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const videoPlayFailedRef = useRef(false); // CRÍTICO: ver Lección 2

// En el useEffect del autoplay patch:
canPlayTimeoutRef.current = setTimeout(() => {
  videoPlayFailedRef.current = true; // sincronización síncrona PRIMERO
  setVideoPlayFailed(true);          // setState después
}, 4000);

// Cleanup obligatorio (zero leaks):
return () => {
  if (canPlayTimeoutRef.current) {
    clearTimeout(canPlayTimeoutRef.current);
    canPlayTimeoutRef.current = null;
  }
};
```

**¿Por qué 4000ms?** Un MP4 local de 2–3MB en 4G LTE hace `canPlay` en < 2s. 4s es el margen seguro para redes lentas sin penalizar usuarios con buena conexión.

**El `.catch()` sigue siendo necesario** para iOS 14 y anteriores (que sí rechazan explícitamente). Cuando el `.catch()` dispara, cancela el Watchdog manualmente y marca fallo:

```typescript
video.play().catch(() => {
  if (canPlayTimeoutRef.current) {
    clearTimeout(canPlayTimeoutRef.current);
    canPlayTimeoutRef.current = null;
  }
  videoPlayFailedRef.current = true;
  setVideoPlayFailed(true);
});
```

---

## LECCIÓN 2 — Race Condition y Stale Closure: el Ref síncrono como barrera

### El problema
`handleCanPlay` se crea con `useCallback([])` — closure estático. Si el Watchdog dispara (t=4s) y `onCanPlay` llega milisegundos después (iOS bufferizó algo justo en ese momento), `handleCanPlay` ve `videoPlayFailed=false` (valor stale de cuando se creó el callback). Procede a desmontar el poster. Resultado: video `display:none` + poster desmontado = **fondo negro permanente**.

### La solución: `useRef` como verdad síncrona

Un ref no tiene closure. Su `.current` siempre refleja el valor real en el momento de lectura.

```typescript
// Declarar junto al timeout ref:
const videoPlayFailedRef = useRef(false);

// En handleCanPlay — guardia como primera línea:
const handleCanPlay = useCallback(() => {
  if (videoPlayFailedRef.current) return; // intercepta el evento fantasma de iOS
  if (canPlayTimeoutRef.current) {
    clearTimeout(canPlayTimeoutRef.current);
    canPlayTimeoutRef.current = null;
  }
  setLoaded(true);
  setPosterVisible(false);
  setTimeout(() => setPosterMounted(false), 350);
}, []); // deps vacías — el ref no necesita estar en deps (es estable por diseño)
```

**Regla de oro:** Siempre asignar `videoPlayFailedRef.current = true` **inmediatamente antes** de `setVideoPlayFailed(true)`. El setState es asíncrono (batch de React); el ref es síncrono.

---

## LECCIÓN 3 — Supresión Absoluta del Shadow DOM de WebKit

### El problema
Safari inyecta un botón de play nativo sobre el `<video>` aunque el video no tenga el atributo `controls`. Lo hace vía Shadow DOM con pseudoelementos propietarios. React no tiene acceso a ese Shadow DOM.

### La solución: bloque CSS global + atributos DOM imperativos

**En `globals.css` (al final del archivo):**
```css
video::-webkit-media-controls,
video::-webkit-media-controls-panel,
video::-webkit-media-controls-overlay-play-button,
video::-webkit-media-controls-start-playback-button,
video::-webkit-media-controls-play-button,
video::-webkit-media-controls-fullscreen-button,
video::-webkit-media-controls-timeline,
video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display {
  display: none !important;
  -webkit-appearance: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
```

**En el `<video>` JSX:**
```tsx
<video
  controls={false}             // apaga controles en React
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="... pointer-events-none"  // un tap no despierta el Shadow DOM
  style={{ display: videoPlayFailed ? 'none' : 'block' }}
>
```

**En el `useEffect` (inyección DOM imperativa — bypasa bugs de hidratación):**
```typescript
video.setAttribute('playsinline', 'true');
video.setAttribute('webkit-playsinline', 'true'); // Safari legacy pre-iOS 10
video.setAttribute('disableremoteplayback', '');  // suprime botón AirPlay
video.setAttribute('x-webkit-airplay', 'deny');   // refuerzo Safari legacy
video.muted = true;
```

**`display: none` cuando `videoPlayFailed`** saca el elemento del render tree de WebKit por completo. El Shadow DOM deja de existir. Ningún control puede aparecer.

---

## LECCIÓN 4 — Opacidades Matemáticas: el Velo Negro

### El problema
El overlay de gradiente tiene colores baked-in con canal alfa alto (`rgba(0,0,0,0.92)`). La `opacity` CSS del elemento **multiplica** con esos valores. A `opacity: 0.45`, el borde izquierdo queda `0.45 × 0.92 = 0.41` — prácticamente negro. Si el poster de fallback es la única imagen visible, el usuario ve negro.

### La solución: tres estados diferenciados de opacidad

```typescript
const overlayOpacity = videoPlayFailed
  ? 0.10   // foto de fallback (posterlowmode): overlay casi invisible
  : posterVisible
    ? 0.55  // poster de carga (poster.webp): legible pero cinematográfico
    : Math.min(0.78 + scrollY * 0.0006, 0.92); // video jugando: oscuridad completa
```

**Complemento — desactivar la vignette en modo fallo:**
La `hero-overlay-vignette` siempre añade ~50% de oscuridad en los bordes. Cuando el video falla y hay una foto estática, apagarla:
```tsx
{!videoPlayFailed && <div className="hero-overlay-vignette" />}
```
Los elementos de contenido (`hero-content-wrapper` con `z-index: 10`) no dependen de este elemento — no hay colapso visual.

---

## LECCIÓN 5 — Arquitectura del Poster de Fallback

### Dos assets distintos, dos propósitos

| Asset | Cuándo | Descripción |
|---|---|---|
| `poster.webp` | Carga normal (antes de `onCanPlay`) | Primer frame del video, look cinematográfico oscuro |
| `posterlowmode.png/webp` | `videoPlayFailed = true` (Low Power Mode) | Foto brillante, bien iluminada, contraste con texto blanco |

### Patrón de implementación

```tsx
{posterMounted && (
  <div
    aria-hidden="true"
    className="absolute inset-0 z-10 transition-opacity duration-300"
    style={{ opacity: posterVisible ? 1 : 0 }}
  >
    <Image
      src={videoPlayFailed ? '/posterlowmode.png' : '/poster.webp'}
      alt=""
      fill
      priority
      loading="eager"
      className="object-cover object-center"
      sizes="100vw"
      quality={85}
    />
  </div>
)}
```

**El poster tiene `z-10` dentro del wrapper** que a su vez tiene `z-index: 0` en el stacking context de la sección. Los overlays del gradiente viven en `z-index: 1` de la sección — **siempre encima del poster**. Por eso la Lección 4 (opacidades) es crítica.

**FCP = 0ms percibido:** Next.js `<Image priority>` inyecta `<link rel="preload">` en el `<head>` — el bitmap llega antes que el JavaScript.

---

## Flujo de estados completo

```
MOUNT
  │
  ├─ posterMounted=true, posterVisible=true → poster.webp visible
  ├─ overlayOpacity=0.55 (posterVisible path)
  ├─ Watchdog Timer inicia (4000ms)
  │
  ├─── onCanPlay dispara (< 4s) ─────────────────────────────────────
  │     │ videoPlayFailedRef.current = false → guardia NO bloquea
  │     │ clearTimeout(watchdog)
  │     │ setPosterVisible(false) → fade CSS 300ms
  │     │ setTimeout 350ms → setPosterMounted(false)
  │     │ overlayOpacity → Math.min(0.78 + scroll, 0.92) [cinematic]
  │     └─ Video de fondo jugando ✓
  │
  └─── Watchdog dispara (4s, onCanPlay nunca llegó) ──────────────────
        │ videoPlayFailedRef.current = true (síncrono)
        │ setVideoPlayFailed(true) (React batch)
        │ overlayOpacity → 0.10
        │ poster.src → /posterlowmode.png
        │ video → display:none
        │ vignette → desmontada del DOM
        │
        ├─ Si onCanPlay llega tarde (race condition):
        │   handleCanPlay → videoPlayFailedRef.current=true → RETURN
        │   Poster permanece montado con posterlowmode.png ✓
        │
        └─ Hero estático brillante permanente ✓
```

---

## Checklist de replicación

Cuando uses esta arquitectura en un nuevo proyecto:

- [ ] `canPlayTimeoutRef` + `videoPlayFailedRef` declarados como `useRef`
- [ ] Watchdog de 4000ms en el `useEffect` del autoplay patch
- [ ] `cleanup` del `useEffect` limpia el timeout (zero memory leaks)
- [ ] `videoPlayFailedRef.current = true` **antes** de `setVideoPlayFailed(true)` en todos los paths
- [ ] `handleCanPlay` tiene guardia `if (videoPlayFailedRef.current) return` como primera línea
- [ ] Atributos DOM inyectados imperativamente: `playsinline`, `webkit-playsinline`, `disableremoteplayback`, `x-webkit-airplay`
- [ ] `controls={false}` + `pointer-events-none` en el `<video>`
- [ ] `display: videoPlayFailed ? 'none' : 'block'` en el style del `<video>`
- [ ] Bloque CSS Shadow DOM en `globals.css` con `!important` en 4 propiedades
- [ ] Tres niveles de `overlayOpacity` (0.10 / 0.55 / dinámico)
- [ ] Vignette condicional: `{!videoPlayFailed && <div className="hero-overlay-vignette" />}`
- [ ] Dos assets poster distintos: `poster.webp` (cinematic) + `posterlowmode.png` (bright)
- [ ] `<Image priority loading="eager">` para el poster (FCP = 0ms percibido)
- [ ] `next.config.ts`: `images.qualities: [75, 85]` si usas `quality={85}`
