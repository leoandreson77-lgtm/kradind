"use client";

import React, { useEffect, useRef } from "react";
import { Snowflake, Sun, CloudRain, RotateCw, Play, Sparkles } from "lucide-react";

export type AtmosphereMode = "snow" | "sunrise" | "rain" | "clear";

interface MountainAtmosphereProps {
  currentMode: AtmosphereMode;
  onSelectMode?: (mode: AtmosphereMode) => void;
  autoLoop?: boolean;
  onToggleLoop?: () => void;
  loopProgress?: number;
  showControls?: boolean;
}

export function MountainAtmosphere({
  currentMode,
  onSelectMode,
  autoLoop = true,
  onToggleLoop,
  loopProgress = 0,
  showControls = false,
}: MountainAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef<AtmosphereMode>(currentMode);
  modeRef.current = currentMode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // ==========================================
    // 1. SNOW PARTICLES (Barf Gir Rahi Hai)
    // ==========================================
    interface SnowflakeParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      sway: number;
      swaySpeed: number;
      opacity: number;
      isSparkle: boolean;
      sparklePhase: number;
    }

    const snowCount = Math.min(140, Math.floor((width * height) / 8000));
    const snowflakes: SnowflakeParticle[] = Array.from({ length: snowCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 0.8,
      speedY: Math.random() * 1.4 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.6 + 0.35,
      isSparkle: Math.random() < 0.15,
      sparklePhase: Math.random() * Math.PI * 2,
    }));

    // ==========================================
    // 2. RAIN PARTICLES (Barish in Mountains)
    // ==========================================
    interface RainParticle {
      x: number;
      y: number;
      length: number;
      speedY: number;
      speedX: number;
      opacity: number;
      thickness: number;
    }

    interface SplashRipple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    const rainCount = Math.min(160, Math.floor((width * height) / 7000));
    const raindrops: RainParticle[] = Array.from({ length: rainCount }, () => ({
      x: Math.random() * (width + 200) - 100,
      y: Math.random() * height,
      length: Math.random() * 20 + 14,
      speedY: Math.random() * 14 + 16,
      speedX: -2.8,
      opacity: Math.random() * 0.45 + 0.25,
      thickness: Math.random() * 1.2 + 0.8,
    }));

    const splashes: SplashRipple[] = [];

    // ==========================================
    // 3. SUN DUST MOTES (Atmospheric Particles)
    // ==========================================
    interface SunMote {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
    }

    const sunMoteCount = Math.min(45, Math.floor((width * height) / 16000));
    const warmMotePalette = [
      "rgba(255, 243, 196,",
      "rgba(255, 214, 138,",
      "rgba(255, 187, 107,",
    ];

    const sunMotes: SunMote[] = Array.from({ length: sunMoteCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.0,
      speedY: -(Math.random() * 0.6 + 0.25),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      color: warmMotePalette[Math.floor(Math.random() * warmMotePalette.length)],
    }));

    // Coastal seabirds for ocean sunrise
    const birds = [
      { xOffset: 0.18, yOffset: 0.32, size: 8, wingSpeed: 0.0055 },
      { xOffset: 0.25, yOffset: 0.28, size: 6.5, wingSpeed: 0.006 },
      { xOffset: 0.30, yOffset: 0.34, size: 5.5, wingSpeed: 0.005 },
      { xOffset: 0.11, yOffset: 0.38, size: 7, wingSpeed: 0.0065 },
    ];

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let startTimestamp = performance.now();

    // Smooth continuous alpha lerping for zero-flicker weather transitions
    let snowAlpha = currentMode === "snow" ? 1 : 0;
    let rainAlpha = currentMode === "rain" ? 1 : 0;
    let sunriseAlpha = currentMode === "sunrise" ? 1 : 0;
    let clearAlpha = currentMode === "clear" ? 1 : 0;

    // ==========================================
    // MAIN RENDERING LOOP
    // ==========================================
    const render = (now: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = now - startTimestamp;
      ctx.clearRect(0, 0, width, height);

      // Lerp alphas towards active mode target (approx. 800ms smooth crossfade)
      const active = modeRef.current;
      const targetSnow = active === "snow" ? 1 : 0;
      const targetRain = active === "rain" ? 1 : 0;
      const targetSunrise = active === "sunrise" ? 1 : 0;
      const targetClear = active === "clear" ? 1 : 0;

      const LERP_SPEED = 0.04;
      snowAlpha += (targetSnow - snowAlpha) * LERP_SPEED;
      rainAlpha += (targetRain - rainAlpha) * LERP_SPEED;
      sunriseAlpha += (targetSunrise - sunriseAlpha) * LERP_SPEED;
      clearAlpha += (targetClear - clearAlpha) * LERP_SPEED;

      // ----------------------------------------
      // A) RENDER SNOW (Barf Gir Rahi Hai - Snow Peaks)
      // ----------------------------------------
      if (snowAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = snowAlpha;
        for (let i = 0; i < snowflakes.length; i++) {
          const flake = snowflakes[i];
          flake.sway += flake.swaySpeed;
          flake.y += flake.speedY;
          flake.x += flake.speedX + Math.sin(flake.sway) * 0.65;

          if (flake.y > height + 10) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }
          if (flake.x > width + 10) flake.x = -10;
          if (flake.x < -10) flake.x = width + 10;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);

          if (flake.isSparkle) {
            flake.sparklePhase += 0.06;
            const sparkleAlpha = flake.opacity * (0.6 + 0.4 * Math.sin(flake.sparklePhase));
            ctx.fillStyle = `rgba(240, 249, 255, ${sparkleAlpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(224, 242, 254, 0.9)";
            ctx.fill();
            ctx.shadowBlur = 0;

            if (flake.radius > 1.8) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.7})`;
              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(flake.x - flake.radius * 1.6, flake.y);
              ctx.lineTo(flake.x + flake.radius * 1.6, flake.y);
              ctx.moveTo(flake.x, flake.y - flake.radius * 1.6);
              ctx.lineTo(flake.x, flake.y + flake.radius * 1.6);
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        ctx.restore();
      }

      // ----------------------------------------
      // B) RENDER RAIN (Barish - Stormy Mountain Clouds)
      // ----------------------------------------
      if (rainAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = rainAlpha;
        ctx.strokeStyle = "rgba(200, 230, 255, 0.55)";
        ctx.lineCap = "round";

        for (let i = 0; i < raindrops.length; i++) {
          const drop = raindrops[i];
          drop.y += drop.speedY;
          drop.x += drop.speedX;

          if (drop.y > height - 10) {
            if (Math.random() < 0.28) {
              splashes.push({
                x: drop.x,
                y: height - Math.random() * 20,
                radius: 1,
                maxRadius: Math.random() * 12 + 6,
                opacity: 0.45,
              });
            }
            drop.y = -drop.length - Math.random() * 40;
            drop.x = Math.random() * (width + 200) - 100;
          }

          ctx.lineWidth = drop.thickness;
          ctx.strokeStyle = `rgba(186, 230, 253, ${drop.opacity})`;
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.speedX * 2, drop.y + drop.length);
          ctx.stroke();
        }

        // Render splash ripples
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i];
          s.radius += 0.85;
          s.opacity -= 0.025;

          if (s.opacity <= 0 || s.radius >= s.maxRadius) {
            splashes.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.radius * 2, s.radius * 0.7, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${s.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Refreshing bright silver mist drifting across valleys
        const mistGrad = ctx.createLinearGradient(0, height - 120, 0, height);
        mistGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        mistGrad.addColorStop(1, "rgba(220, 245, 255, 0.18)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, height - 120, width, 120);
        ctx.restore();
      }

      // ----------------------------------------
      // C) RENDER OCEAN SUNRISE (Real Cinematic Golden Hour Atmosphere)
      // ----------------------------------------
      if (sunriseAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = sunriseAlpha;
        // Natural camera golden hour warmth & gentle morning sunlight breathing
        const sunX = width * 0.72;
        const sunY = height * 0.42;
        const breathe = Math.sin(now * 0.001);
        const intensity = 0.85 + breathe * 0.15;

        // 1. SOFT PHOTOGRAPHIC LENS BLOOM (Natural diffuse haze, NO artificial shapes)
        const bloomRadius = Math.max(width, height) * 0.55;
        const skyBloom = ctx.createRadialGradient(
          sunX,
          sunY,
          20,
          sunX,
          sunY,
          bloomRadius
        );
        skyBloom.addColorStop(0, `rgba(255, 245, 210, ${0.28 * intensity})`);
        skyBloom.addColorStop(0.25, `rgba(255, 200, 100, ${0.15 * intensity})`);
        skyBloom.addColorStop(0.55, `rgba(245, 140, 50, ${0.05 * intensity})`);
        skyBloom.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = skyBloom;
        ctx.fillRect(0, 0, width, height);

        // 2. FLOATING GOLDEN SUNLIGHT DUST MOTES (Real atmospheric golden particles)
        for (let i = 0; i < sunMotes.length; i++) {
          const mote = sunMotes[i];
          mote.y += mote.speedY * 0.7;
          mote.x += mote.speedX + Math.sin(now * 0.0012 + i) * 0.35;
          mote.pulse += mote.pulseSpeed;

          if (mote.y < -15) {
            mote.y = height + 15;
            mote.x = Math.random() * width;
          }
          if (mote.x < -15) mote.x = width + 15;
          if (mote.x > width + 15) mote.x = -15;

          const sparkleAlpha = mote.opacity * (0.4 + 0.45 * Math.sin(mote.pulse)) * intensity;
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${mote.color}${sparkleAlpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 220, 120, 0.6)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // 3. SILHOUETTED COASTAL SEABIRDS (Natural scale in distant sky)
        ctx.strokeStyle = "rgba(35, 20, 15, 0.65)";
        ctx.lineWidth = 1.3;
        ctx.lineCap = "round";

        for (let i = 0; i < birds.length; i++) {
          const bird = birds[i];
          const birdX = ((now * 0.018 + bird.xOffset * width) % (width + 80)) - 40;
          const birdY = bird.yOffset * height + Math.sin(now * 0.001 + i) * 5;
          const wingFlap = Math.sin(now * bird.wingSpeed) * (bird.size * 0.35);

          ctx.beginPath();
          ctx.moveTo(birdX, birdY);
          ctx.quadraticCurveTo(
            birdX - bird.size * 0.5,
            birdY - bird.size * 0.5 + wingFlap,
            birdX - bird.size,
            birdY - bird.size * 0.15 + wingFlap
          );
          ctx.moveTo(birdX, birdY);
          ctx.quadraticCurveTo(
            birdX + bird.size * 0.5,
            birdY - bird.size * 0.5 + wingFlap,
            birdX + bird.size,
            birdY - bird.size * 0.15 + wingFlap
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // ----------------------------------------
      // D) RENDER CLEAR / TROPICAL (Mausam Saaf - Palms & Clear Valleys)
      // ----------------------------------------
      if (clearAlpha > 0.005) {
        ctx.save();
        ctx.globalAlpha = clearAlpha;
        for (let i = 0; i < Math.min(25, sunMotes.length); i++) {
          const mote = sunMotes[i];
          mote.y += mote.speedY * 0.6;
          mote.x += mote.speedX + Math.sin(now * 0.001 + i) * 0.25;
          mote.pulse += mote.pulseSpeed;

          if (mote.y < -10) {
            mote.y = height + 10;
            mote.x = Math.random() * width;
          }
          if (mote.x < -10) mote.x = width + 10;
          if (mote.x > width + 10) mote.x = -10;

          const currentAlpha = mote.opacity * (0.35 + 0.3 * Math.sin(mote.pulse));
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 180, ${currentAlpha})`;
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* High Performance HTML5 Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* Atmospheric Ambient Mood Color Wash with smooth CSS crossfade */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,197,253,0.16),_transparent_70%)] pointer-events-none transition-opacity duration-1000 ${
          currentMode === "snow" ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_73%_40%,_rgba(251,146,60,0.22),_rgba(245,158,11,0.06)_45%,_transparent_75%)] pointer-events-none transition-opacity duration-1000 ${
          currentMode === "sunrise" ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b from-slate-900/15 via-transparent to-slate-950/30 pointer-events-none transition-opacity duration-1000 ${
          currentMode === "rain" ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(253,224,71,0.10),_transparent_65%)] pointer-events-none transition-opacity duration-1000 ${
          currentMode === "clear" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Synchronized Weather Controller Badge with Progress Indicator */}
      {showControls && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-auto z-20">
          <div className="flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-2xl text-xs font-semibold text-white">
            
            <button
              type="button"
              onClick={() => onSelectMode?.("sunrise")}
              title="Ocean Sunrise (Real Ocean Photo)"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentMode === "sunrise"
                  ? "bg-amber-500/80 text-white shadow-sm border border-amber-300/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Ocean Sunrise</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode?.("snow")}
              title="Snowfall (Himalayan Snow Peaks)"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentMode === "snow"
                  ? "bg-sky-500/80 text-white shadow-sm border border-sky-300/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-sky-200" />
              <span className="hidden sm:inline">Snow</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode?.("rain")}
              title="Monsoon Rain (Stormy Mountain Clouds)"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentMode === "rain"
                  ? "bg-teal-600/80 text-white shadow-sm border border-teal-300/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-teal-200" />
              <span className="hidden sm:inline">Rain</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectMode?.("clear")}
              title="Clear Tropical Skies (Backwaters & Palms)"
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
                currentMode === "clear"
                  ? "bg-emerald-600/80 text-white shadow-sm border border-emerald-300/40"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* Loop Timestamp Toggle & Progress Indicator */}
            {onToggleLoop && (
              <button
                type="button"
                onClick={onToggleLoop}
                title={autoLoop ? "Loop Active (Click to Pause)" : "Resume Loop Cycle"}
                className={`relative overflow-hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer text-[11px] font-bold border ${
                  autoLoop
                    ? "bg-emerald-950/80 border-emerald-400/50 text-emerald-300"
                    : "bg-slate-900/60 border-white/15 text-slate-400 hover:text-white"
                }`}
              >
                {autoLoop && (
                  <span
                    className="absolute left-0 bottom-0 top-0 bg-emerald-500/30 transition-all pointer-events-none"
                    style={{ width: `${Math.round(loopProgress * 100)}%` }}
                  />
                )}
                {autoLoop ? (
                  <>
                    <RotateCw className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: "3.5s" }} />
                    <span className="relative z-10 font-mono">Loop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-slate-300" />
                    <span className="relative z-10 font-mono">Paused</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
