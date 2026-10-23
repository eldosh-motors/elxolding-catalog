(function(){
  'use strict';
  // Create Canvas for Interactive Hexagonal Tech / Laboratory Background
  var canvas = document.createElement('canvas');
  canvas.id = 'tech-bg-canvas';
  document.body.prepend(canvas);

  // Apply styling directly
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  canvas.style.opacity = '0.9';

  var ctx = canvas.getContext('2d');
  var w, h;
  var mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', function(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', function() {
    mouse.active = false;
  });

  // Touch support for mobile devices
  window.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  // Floating Hexagonal Cells & Laboratory Nodes
  var hexRadius = 36;
  var hexWidth = Math.sqrt(3) * hexRadius;
  var hexHeight = 2 * hexRadius;

  // Grid Points for subtle background honeycomb
  var gridPoints = [];
  function initGrid() {
    gridPoints = [];
    var cols = Math.ceil(w / hexWidth) + 2;
    var rows = Math.ceil(h / (hexHeight * 0.75)) + 2;
    for (var r = -1; r < rows; r++) {
      for (var c = -1; c < cols; c++) {
        var x = c * hexWidth + (r % 2 === 0 ? 0 : hexWidth / 2);
        var y = r * (hexHeight * 0.75);
        gridPoints.push({
          baseX: x,
          baseY: y,
          x: x,
          y: y,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.02
        });
      }
    }
  }
  initGrid();
  window.addEventListener('resize', initGrid);

  // Floating Laboratory / Scientific Particles (Molecules, Hexagons, Data Nodes)
  var particles = [];
  var PARTICLE_COUNT = Math.min(38, Math.max(18, Math.floor(window.innerWidth / 40)));

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      size: 14 + Math.random() * 26,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.012,
      type: Math.random() > 0.4 ? 'hex' : (Math.random() > 0.5 ? 'molecule' : 'pulse-ring'),
      alpha: 0.15 + Math.random() * 0.35,
      color: Math.random() > 0.4 ? '#008b94' : '#00b7c2' // ELXOLDING Teal accents
    });
  }

  // Draw regular polygon (e.g. Hexagon)
  function drawPolygon(x, y, radius, sides, rotation) {
    ctx.beginPath();
    for (var i = 0; i < sides; i++) {
      var angle = rotation + (i * 2 * Math.PI / sides);
      var px = x + radius * Math.cos(angle);
      var py = y + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  var time = 0;

  function render() {
    time += 0.015;

    // Smooth mouse interpolation
    if (mouse.active) {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
    } else {
      mouse.x += (w * 0.5 + Math.cos(time * 0.5) * 200 - mouse.x) * 0.02;
      mouse.y += (h * 0.5 + Math.sin(time * 0.5) * 140 - mouse.y) * 0.02;
    }

    ctx.clearRect(0, 0, w, h);

    // Subtle interactive honeycomb grid lines
    ctx.lineWidth = 1;
    for (var j = 0; j < gridPoints.length; j++) {
      var gp = gridPoints[j];
      gp.pulse += gp.speed;

      var dx = mouse.x - gp.baseX;
      var dy = mouse.y - gp.baseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var maxDist = 220;

      // Parallax shift away/towards mouse
      if (dist < maxDist) {
        var force = (1 - dist / maxDist) * 18;
        gp.x = gp.baseX - (dx / dist) * force;
        gp.y = gp.baseY - (dy / dist) * force;
      } else {
        gp.x += (gp.baseX - gp.x) * 0.05;
        gp.y += (gp.baseY - gp.y) * 0.05;
      }

      // Proximity glow to cursor
      if (dist < maxDist) {
        var intensity = (1 - dist / maxDist) * 0.35;
        ctx.strokeStyle = 'rgba(0, 139, 148, ' + intensity.toFixed(3) + ')';
        ctx.fillStyle = 'rgba(0, 214, 224, ' + (intensity * 0.12).toFixed(3) + ')';
        drawPolygon(gp.x, gp.y, hexRadius * 0.88, 6, 0);
        ctx.stroke();
        ctx.fill();

        // Small tech vertex dots
        ctx.fillStyle = 'rgba(0, 180, 195, ' + (intensity * 1.5).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(gp.x, gp.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Connect floating particles with tech laser / bond lines
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var p1 = particles[a];
        var p2 = particles[b];
        var cdx = p1.x - p2.x;
        var cdy = p1.y - p2.y;
        var cdist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cdist < 140) {
          var lineAlpha = (1 - cdist / 140) * 0.16;
          ctx.strokeStyle = 'rgba(0, 139, 148, ' + lineAlpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Floating particles (Hexagons & Scientific / Lab Molecule Nodes)
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];

      // Update motion
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;

      // Mouse interactive repulse / attract
      var mdx = mouse.x - p.x;
      var mdy = mouse.y - p.y;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 180 && mdist > 1) {
        var mforce = (1 - mdist / 180) * 1.2;
        p.x -= (mdx / mdist) * mforce;
        p.y -= (mdy / mdist) * mforce;
      }

      // Screen edge wrapping
      if (p.x < -60) p.x = w + 60;
      if (p.x > w + 60) p.x = -60;
      if (p.y < -60) p.y = h + 60;
      if (p.y > h + 60) p.y = -60;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (p.type === 'hex') {
        // Hexagonal tech plate with inner border
        ctx.strokeStyle = 'rgba(0, 139, 148, ' + p.alpha + ')';
        ctx.fillStyle = 'rgba(0, 139, 148, ' + (p.alpha * 0.08) + ')';
        drawPolygon(0, 0, p.size, 6, 0);
        ctx.stroke();
        ctx.fill();

        // Inner core
        drawPolygon(0, 0, p.size * 0.45, 6, 0);
        ctx.strokeStyle = 'rgba(0, 180, 195, ' + (p.alpha * 0.7) + ')';
        ctx.stroke();
      } else if (p.type === 'molecule') {
        // Lab molecule: Center nucleus with 3 bound nodes
        ctx.fillStyle = 'rgba(0, 139, 148, ' + (p.alpha * 0.8) + ')';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        for (var m = 0; m < 3; m++) {
          var mAngle = (m * 2 * Math.PI / 3) + p.rot;
          var nx = Math.cos(mAngle) * (p.size * 0.85);
          var ny = Math.sin(mAngle) * (p.size * 0.85);

          ctx.strokeStyle = 'rgba(0, 139, 148, ' + (p.alpha * 0.4) + ')';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(nx, ny);
          ctx.stroke();

          ctx.fillStyle = 'rgba(0, 183, 194, ' + (p.alpha * 0.9) + ')';
          ctx.beginPath();
          ctx.arc(nx, ny, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // High-tech pulse ring
        var wave = (Math.sin(time * 2 + k) + 1) * 0.5;
        ctx.strokeStyle = 'rgba(0, 183, 194, ' + (p.alpha * (0.3 + wave * 0.4)) + ')';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * (0.6 + wave * 0.3), 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(0, 139, 148, ' + (p.alpha * 0.6) + ')';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
