(function(){
  'use strict';

  function initBg(){
    if (document.getElementById('tech-bg-canvas')) return;

    var canvas = document.createElement('canvas');
    canvas.id = 'tech-bg-canvas';
    document.body.appendChild(canvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.display = 'block';

    var ctx = canvas.getContext('2d');
    var w, h;
    var mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.5,
      active: false
    };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initHexGrid();
      initScienceElements();
    }
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function(e) {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('touchmove', function(e) {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    // 1. Hexagonal Grid parameters (finer, more delicate and scientific)
    var R = 64; // Slightly bigger, elegant hexagons
    var W = Math.sqrt(3) * R;
    var H = 1.5 * R;

    var nodes = [];
    var edges = [];

    function getKey(x, y) {
      return Math.round(x) + '_' + Math.round(y);
    }

    function initHexGrid() {
      nodes = [];
      edges = [];
      var cols = Math.ceil(w / W) + 3;
      var rows = Math.ceil(h / H) + 3;
      var nodeMap = new Map();

      function addNode(x, y) {
        var key = getKey(x, y);
        if (nodeMap.has(key)) return nodeMap.get(key);

        var hasDot = Math.random() < 0.22;
        var dotRadius = hasDot ? (1.8 + Math.random() * 2.8) : 0;
        var pulseSpeed = 0.02 + Math.random() * 0.03;

        var node = {
          baseX: x,
          baseY: y,
          x: x,
          y: y,
          hasDot: hasDot,
          dotRadius: dotRadius,
          pulseSpeed: pulseSpeed,
          pulse: Math.random() * Math.PI * 2,
          baseAlpha: 0.2 + Math.random() * 0.25
        };
        nodeMap.set(key, node);
        nodes.push(node);
        return node;
      }

      for (var r = -1; r < rows; r++) {
        for (var c = -1; c < cols; c++) {
          var cx = c * W + (r % 2 === 0 ? 0 : W / 2);
          var cy = r * H;

          var hexPoints = [];
          for (var i = 0; i < 6; i++) {
            var angle = (i * Math.PI / 3) + (Math.PI / 6);
            var px = cx + R * Math.cos(angle);
            var py = cy + R * Math.sin(angle);
            hexPoints.push(addNode(px, py));
          }

          for (var e = 0; e < 6; e++) {
            var p1 = hexPoints[e];
            var p2 = hexPoints[(e + 1) % 6];
            if (Math.random() > 0.15) {
              edges.push({ a: p1, b: p2 });
            }
          }
        }
      }
    }

    // 2. Science Objects: DNA Strands, Rutherford Atoms, Chemical Molecules
    var scienceObjects = [];

    function initScienceElements() {
      scienceObjects = [];

      // A) DNA Helices (2 rotating floating 3D DNA double-helices)
      for (var d = 0; d < 2; d++) {
        scienceObjects.push({
          type: 'dna',
          x: (d === 0 ? w * 0.15 : w * 0.85) + (Math.random() - 0.5) * 100,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (d === 0 ? -0.35 : 0.35),
          nodesCount: 16,
          length: 220,
          radius: 32,
          angle: d * Math.PI * 0.5,
          rotSpeed: 0.018,
          alpha: 0.45
        });
      }

      // B) Rutherford Laboratory Atoms (Nucleus + orbiting electron rings)
      var atomCount = Math.min(5, Math.max(3, Math.floor(w / 350)));
      for (var a = 0; a < atomCount; a++) {
        scienceObjects.push({
          type: 'atom',
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 26 + Math.random() * 20,
          rot: Math.random() * Math.PI,
          rotSpeed: 0.012 + Math.random() * 0.015,
          electronAngle: Math.random() * Math.PI * 2,
          electronSpeed: 0.04 + Math.random() * 0.03,
          rings: 3,
          alpha: 0.4 + Math.random() * 0.3
        });
      }

      // C) Organic Chemical Molecules (Benzene rings, Water, Glucose models)
      var moleculeCount = Math.min(7, Math.max(4, Math.floor(w / 280)));
      for (var m = 0; m < moleculeCount; m++) {
        var molType = Math.random() > 0.5 ? 'benzene' : (Math.random() > 0.5 ? 'h2o' : 'cluster');
        scienceObjects.push({
          type: 'molecule',
          molType: molType,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          size: 22 + Math.random() * 16,
          alpha: 0.42 + Math.random() * 0.35
        });
      }
    }

    resize();

    var time = 0;

    function render() {
      time += 0.015;

      // Mouse smoothing
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x += (w * 0.5 + Math.cos(time * 0.6) * 180 - mouse.x) * 0.025;
        mouse.y += (h * 0.5 + Math.sin(time * 0.5) * 120 - mouse.y) * 0.025;
      }

      // 1. Clean, elegant radiant light-cyan gradient (pure, non-obtrusive, like high-end lab)
      var grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#6fe2ff');    // Delicate light cyan
      grad.addColorStop(0.35, '#d6f3ff'); // Soft sky blue
      grad.addColorStop(0.55, '#f5fcff'); // Crystal pure white in reading center
      grad.addColorStop(0.85, '#b9ecff'); // Light cyan
      grad.addColorStop(1, '#6ee0ff');    // Light cyan bottom-right
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Parallax physics for grid nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.pulse += n.pulseSpeed;

        var dx = mouse.x - n.baseX;
        var dy = mouse.y - n.baseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = 260;

        if (dist < maxDist && dist > 1) {
          var force = (1 - dist / maxDist) * 20;
          n.x = n.baseX - (dx / dist) * force;
          n.y = n.baseY - (dy / dist) * force;
        } else {
          n.x += (n.baseX - n.x) * 0.06;
          n.y += (n.baseY - n.y) * 0.06;
        }
      }

      // 3. Draw Hexagonal Grid Lines (Delicate & Clean #00a4ea)
      ctx.lineWidth = 1.0;
      for (var e = 0; e < edges.length; e++) {
        var edge = edges[e];
        var p1 = edge.a;
        var p2 = edge.b;

        var lineAlpha = (p1.baseAlpha + p2.baseAlpha) * 0.45;

        var midX = (p1.x + p2.x) * 0.5;
        var midY = (p1.y + p2.y) * 0.5;
        var mdx = mouse.x - midX;
        var mdy = mouse.y - midY;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 220) {
          lineAlpha = Math.min(0.85, lineAlpha + (1 - mdist / 220) * 0.4);
          ctx.strokeStyle = 'rgba(0, 140, 220, ' + lineAlpha.toFixed(2) + ')';
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = 'rgba(0, 165, 235, ' + lineAlpha.toFixed(2) + ')';
          ctx.lineWidth = 0.9;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 4. Draw Hexagon Joint Tech Dots (Subtle, refined)
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        if (nd.hasDot) {
          var dAlpha = Math.min(0.9, nd.baseAlpha + Math.sin(nd.pulse) * 0.15);
          var curRadius = nd.dotRadius;

          var ddx = mouse.x - nd.x;
          var ddy = mouse.y - nd.y;
          var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 180) {
            dAlpha = 0.95;
            curRadius *= 1.3;
          }

          ctx.fillStyle = 'rgba(0, 145, 230, ' + dAlpha.toFixed(2) + ')';
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, curRadius, 0, Math.PI * 2);
          ctx.fill();

          if (nd.dotRadius > 2.5) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, curRadius * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 5. Draw Science Laboratory Elements (DNA, Atoms, Molecules)
      for (var s = 0; s < scienceObjects.length; s++) {
        var obj = scienceObjects[s];

        // Move element
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Mouse interactive repel/attract
        var odx = mouse.x - obj.x;
        var ody = mouse.y - obj.y;
        var odist = Math.sqrt(odx * odx + ody * ody);
        if (odist < 180 && odist > 1) {
          var oforce = (1 - odist / 180) * 1.6;
          obj.x -= (odx / odist) * oforce;
          obj.y -= (ody / odist) * oforce;
        }

        // Screen wrap
        if (obj.x < -80) obj.x = w + 80;
        if (obj.x > w + 80) obj.x = -80;
        if (obj.y < -120) obj.y = h + 120;
        if (obj.y > h + 120) obj.y = -120;

        ctx.save();

        if (obj.type === 'dna') {
          // --- DNA DOUBLE HELIX ---
          obj.angle += obj.rotSpeed;
          var stepY = obj.length / obj.nodesCount;
          var startY = obj.y - obj.length / 2;

          for (var nIdx = 0; nIdx < obj.nodesCount; nIdx++) {
            var currY = startY + nIdx * stepY;
            var phase = obj.angle + (nIdx * 0.45);
            var x1 = obj.x + Math.sin(phase) * obj.radius;
            var x2 = obj.x - Math.sin(phase) * obj.radius;
            var depth = Math.cos(phase); // for 3D illusion

            // Hydrogen bond line
            ctx.strokeStyle = 'rgba(0, 160, 230, ' + (obj.alpha * 0.35) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, currY);
            ctx.lineTo(x2, currY);
            ctx.stroke();

            // Nucleotide base nodes (Strand 1)
            var r1 = 3 + depth * 1.2;
            ctx.fillStyle = 'rgba(0, 139, 148, ' + (obj.alpha * (0.6 + depth * 0.35)) + ')';
            ctx.beginPath();
            ctx.arc(x1, currY, Math.max(1.5, r1), 0, Math.PI * 2);
            ctx.fill();

            // Nucleotide base nodes (Strand 2)
            var r2 = 3 - depth * 1.2;
            ctx.fillStyle = 'rgba(0, 180, 235, ' + (obj.alpha * (0.6 - depth * 0.35)) + ')';
            ctx.beginPath();
            ctx.arc(x2, currY, Math.max(1.5, r2), 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (obj.type === 'atom') {
          // --- RUTHERFORD ATOM (Nucleus & Electron Orbitals) ---
          obj.rot += obj.rotSpeed;
          obj.electronAngle += obj.electronSpeed;

          ctx.translate(obj.x, obj.y);

          // Central Nucleus (Protons & Neutrons)
          ctx.fillStyle = 'rgba(0, 139, 148, ' + (obj.alpha * 0.9) + ')';
          ctx.beginPath();
          ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(-1, -1, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // 3 Orbital Ellipses rotated at 60deg
          for (var rIdx = 0; rIdx < obj.rings; rIdx++) {
            ctx.save();
            ctx.rotate(obj.rot + (rIdx * Math.PI / 3));

            // Orbit path
            ctx.strokeStyle = 'rgba(0, 160, 230, ' + (obj.alpha * 0.4) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, 0, obj.size, obj.size * 0.38, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Orbiting Electron
            var elAngle = obj.electronAngle + (rIdx * 1.8);
            var elX = Math.cos(elAngle) * obj.size;
            var elY = Math.sin(elAngle) * (obj.size * 0.38);

            ctx.fillStyle = 'rgba(0, 214, 224, ' + (obj.alpha * 0.95) + ')';
            ctx.beginPath();
            ctx.arc(elX, elY, 2.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

        } else if (obj.type === 'molecule') {
          // --- CHEMICAL MOLECULE ---
          obj.rot += obj.rotSpeed;
          ctx.translate(obj.x, obj.y);
          ctx.rotate(obj.rot);

          if (obj.molType === 'benzene') {
            // Benzene Hexagon Ring C6H6
            var bR = obj.size * 0.7;
            ctx.strokeStyle = 'rgba(0, 150, 220, ' + (obj.alpha * 0.5) + ')';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (var bi = 0; bi < 6; bi++) {
              var bAngle = bi * Math.PI / 3;
              var bx = Math.cos(bAngle) * bR;
              var by = Math.sin(bAngle) * bR;
              if (bi === 0) ctx.moveTo(bx, by);
              else ctx.lineTo(bx, by);
            }
            ctx.closePath();
            ctx.stroke();

            // Inner resonance circle
            ctx.beginPath();
            ctx.arc(0, 0, bR * 0.55, 0, Math.PI * 2);
            ctx.stroke();

            // 6 Carbon/Hydrogen vertex atoms
            for (var bj = 0; bj < 6; bj++) {
              var ba = bj * Math.PI / 3;
              ctx.fillStyle = 'rgba(0, 140, 215, ' + (obj.alpha * 0.85) + ')';
              ctx.beginPath();
              ctx.arc(Math.cos(ba) * bR, Math.sin(ba) * bR, 3.2, 0, Math.PI * 2);
              ctx.fill();
            }

          } else if (obj.molType === 'h2o') {
            // H2O Water Molecule (Oxygen center + 2 Hydrogen bonds)
            var bondL = obj.size * 0.8;
            var hAngle1 = Math.PI * 0.65;
            var hAngle2 = Math.PI * 1.35;

            var h1x = Math.cos(hAngle1) * bondL;
            var h1y = Math.sin(hAngle1) * bondL;
            var h2x = Math.cos(hAngle2) * bondL;
            var h2y = Math.sin(hAngle2) * bondL;

            // Chemical bonds
            ctx.strokeStyle = 'rgba(0, 160, 230, ' + (obj.alpha * 0.55) + ')';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(h1x, h1y);
            ctx.moveTo(0, 0); ctx.lineTo(h2x, h2y);
            ctx.stroke();

            // Oxygen atom (center, larger)
            ctx.fillStyle = 'rgba(0, 139, 148, ' + (obj.alpha * 0.9) + ')';
            ctx.beginPath();
            ctx.arc(0, 0, 5.2, 0, Math.PI * 2);
            ctx.fill();

            // Hydrogen atoms
            ctx.fillStyle = 'rgba(0, 195, 235, ' + (obj.alpha * 0.85) + ')';
            ctx.beginPath();
            ctx.arc(h1x, h1y, 3.2, 0, Math.PI * 2);
            ctx.arc(h2x, h2y, 3.2, 0, Math.PI * 2);
            ctx.fill();

          } else {
            // Multi-atom lab cluster
            for (var cIdx = 0; cIdx < 4; cIdx++) {
              var ca = cIdx * Math.PI * 0.5;
              var cx2 = Math.cos(ca) * (obj.size * 0.65);
              var cy2 = Math.sin(ca) * (obj.size * 0.65);

              ctx.strokeStyle = 'rgba(0, 150, 220, ' + (obj.alpha * 0.45) + ')';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(cx2, cy2);
              ctx.stroke();

              ctx.fillStyle = 'rgba(0, 170, 230, ' + (obj.alpha * 0.8) + ')';
              ctx.beginPath();
              ctx.arc(cx2, cy2, 3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = 'rgba(0, 139, 148, ' + (obj.alpha * 0.9) + ')';
            ctx.beginPath();
            ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBg);
  } else {
    initBg();
  }
})();
