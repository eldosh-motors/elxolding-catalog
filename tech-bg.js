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
      initParticles();
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

    // Hexagon Grid Parameters
    var R = 52; // Hex radius
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

        var hasDot = Math.random() < 0.35;
        var dotRadius = hasDot ? (2.2 + Math.random() * 3.8) : 0;
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
          baseAlpha: 0.35 + Math.random() * 0.4
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
            if (Math.random() > 0.12) {
              edges.push({ a: p1, b: p2 });
            }
          }
        }
      }
    }

    // Floating lab particles
    var freeParticles = [];
    function initParticles() {
      freeParticles = [];
      var count = Math.min(36, Math.max(18, Math.floor(window.innerWidth / 40)));
      for (var i = 0; i < count; i++) {
        freeParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 2.2 + Math.random() * 3.5,
          alpha: 0.35 + Math.random() * 0.5
        });
      }
    }

    resize();

    var time = 0;

    function render() {
      time += 0.015;

      // Mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      } else {
        mouse.x += (w * 0.5 + Math.cos(time * 0.7) * 200 - mouse.x) * 0.03;
        mouse.y += (h * 0.5 + Math.sin(time * 0.5) * 130 - mouse.y) * 0.03;
      }

      // 1. Draw Vibrant Cyan / Light Blue Background from user's image
      var grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#58d8ff');    // Rich vibrant cyan top-left
      grad.addColorStop(0.35, '#c8f0ff'); // Radiant sky blue
      grad.addColorStop(0.55, '#f4fbff'); // Clean soft illuminated center
      grad.addColorStop(0.85, '#9ee5ff'); // Fresh cyan
      grad.addColorStop(1, '#50d4ff');    // Rich vibrant cyan bottom-right
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Parallax physics for grid nodes
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.pulse += n.pulseSpeed;

        var dx = mouse.x - n.baseX;
        var dy = mouse.y - n.baseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = 300;

        if (dist < maxDist && dist > 1) {
          var force = (1 - dist / maxDist) * 28;
          n.x = n.baseX - (dx / dist) * force;
          n.y = n.baseY - (dy / dist) * force;
        } else {
          n.x += (n.baseX - n.x) * 0.06;
          n.y += (n.baseY - n.y) * 0.06;
        }
      }

      // 3. Draw Hexagonal Circuit Lines (Bold & Sharp #008ece / #00a4ea)
      ctx.lineWidth = 1.3;
      for (var e = 0; e < edges.length; e++) {
        var edge = edges[e];
        var p1 = edge.a;
        var p2 = edge.b;

        var lineAlpha = (p1.baseAlpha + p2.baseAlpha) * 0.5;

        var midX = (p1.x + p2.x) * 0.5;
        var midY = (p1.y + p2.y) * 0.5;
        var mdx = mouse.x - midX;
        var mdy = mouse.y - midY;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 240) {
          lineAlpha = Math.min(1, lineAlpha + (1 - mdist / 240) * 0.5);
          ctx.strokeStyle = 'rgba(0, 130, 215, ' + lineAlpha.toFixed(2) + ')';
          ctx.lineWidth = 1.8;
        } else {
          ctx.strokeStyle = 'rgba(0, 160, 235, ' + lineAlpha.toFixed(2) + ')';
          ctx.lineWidth = 1.2;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 4. Draw Hexagon Joint Tech Dots
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        if (nd.hasDot) {
          var dAlpha = Math.min(1, nd.baseAlpha + Math.sin(nd.pulse) * 0.2);
          var curRadius = nd.dotRadius;

          var ddx = mouse.x - nd.x;
          var ddy = mouse.y - nd.y;
          var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 200) {
            dAlpha = 1;
            curRadius *= 1.45;
          }

          ctx.fillStyle = 'rgba(0, 130, 220, ' + dAlpha.toFixed(2) + ')';
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, curRadius, 0, Math.PI * 2);
          ctx.fill();

          // High-tech white core dot
          if (nd.dotRadius > 2.8) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(nd.x, nd.y, curRadius * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 5. Draw Free Floating Tech Lab Particles
      for (var f = 0; f < freeParticles.length; f++) {
        var fp = freeParticles[f];
        fp.x += fp.vx;
        fp.y += fp.vy;

        if (fp.x < -20) fp.x = w + 20;
        if (fp.x > w + 20) fp.x = -20;
        if (fp.y < -20) fp.y = h + 20;
        if (fp.y > h + 20) fp.y = -20;

        var fdx = mouse.x - fp.x;
        var fdy = mouse.y - fp.y;
        var fdist = Math.sqrt(fdx * fdx + fdy * fdy);
        if (fdist < 160 && fdist > 1) {
          var fforce = (1 - fdist / 160) * 2;
          fp.x -= (fdx / fdist) * fforce;
          fp.y -= (fdy / fdist) * fforce;
        }

        ctx.fillStyle = 'rgba(0, 140, 230, ' + fp.alpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
        ctx.fill();
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
