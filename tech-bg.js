(function(){
  'use strict';
  // Precise Futuristic Hexagonal Tech & Lab Canvas exactly matching reference
  var canvas = document.createElement('canvas');
  canvas.id = 'tech-bg-canvas';
  document.body.prepend(canvas);

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  canvas.style.opacity = '1';

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
  }
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function(e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', function() {
    mouse.active = false;
  });

  window.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches[0]) {
      mouse.targetX = e.touches[0].clientX;
      mouse.targetY = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  // Hexagon geometry
  var R = 54; // Radius of hexagons
  var W = Math.sqrt(3) * R;
  var H = 1.5 * R;

  var nodes = [];
  var edges = [];

  function initHexGrid() {
    nodes = [];
    edges = [];
    var cols = Math.ceil(w / W) + 3;
    var rows = Math.ceil(h / H) + 3;

    var nodeMap = new Map();

    function getKey(x, y) {
      return Math.round(x) + '_' + Math.round(y);
    }

    function addNode(x, y) {
      var key = getKey(x, y);
      if (nodeMap.has(key)) return nodeMap.get(key);

      // Distance from center to create the soft gradient fade in the middle (like reference)
      var nx = (x / w) - 0.5;
      var ny = (y / h) - 0.5;
      var distFromCenter = Math.sqrt(nx * nx + ny * ny);

      var hasDot = Math.random() < 0.28;
      var dotRadius = hasDot ? (1.5 + Math.random() * 3.5) : 0;
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
        // Edge nodes are more visible, center is subtly faded like reference image
        baseAlpha: Math.min(0.65, Math.max(0.12, distFromCenter * 1.3))
      };
      nodeMap.set(key, node);
      nodes.push(node);
      return node;
    }

    // Build hexagonal grid vertices and edges
    for (var r = -1; r < rows; r++) {
      for (var c = -1; c < cols; c++) {
        var cx = c * W + (r % 2 === 0 ? 0 : W / 2);
        var cy = r * H;

        // Skip some central hexes to keep center bright and clean for content
        var ncx = (cx / w) - 0.5;
        var ncy = (cy / h) - 0.5;
        var centerDist = Math.sqrt(ncx * ncx + ncy * ncy);
        if (centerDist < 0.22 && Math.random() > 0.15) continue;

        var hexPoints = [];
        for (var i = 0; i < 6; i++) {
          var angle = (i * Math.PI / 3) + (Math.PI / 6);
          var px = cx + R * Math.cos(angle);
          var py = cy + R * Math.sin(angle);
          hexPoints.push(addNode(px, py));
        }

        // Add 6 edges
        for (var e = 0; e < 6; e++) {
          var p1 = hexPoints[e];
          var p2 = hexPoints[(e + 1) % 6];
          // Randomly skip a few edges for that dynamic open-circuit / tech look
          if (Math.random() > 0.18) {
            edges.push({ a: p1, b: p2 });
          }
        }
      }
    }
  }

  // Floating Laboratory / Scientific Particles (Blue dots & nodes moving gently)
  var freeParticles = [];
  function initParticles() {
    freeParticles = [];
    var count = Math.min(32, Math.max(16, Math.floor(window.innerWidth / 45)));
    for (var i = 0; i < count; i++) {
      freeParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: 1.8 + Math.random() * 3.8,
        alpha: 0.25 + Math.random() * 0.55
      });
    }
  }

  resize();
  initParticles();

  var time = 0;

  function render() {
    time += 0.015;

    // Smooth mouse follow
    if (mouse.active) {
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;
    } else {
      // Gentle idle ambient floating
      mouse.x += (w * 0.5 + Math.cos(time * 0.6) * 160 - mouse.x) * 0.02;
      mouse.y += (h * 0.5 + Math.sin(time * 0.5) * 110 - mouse.y) * 0.02;
    }

    // 1. Draw smooth bright cyan/blue laboratory gradient background (exact match with user image)
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#7ce4ff');    // Light radiant cyan at top-left
    grad.addColorStop(0.48, '#eaf7fd'); // Soft illuminated clean center
    grad.addColorStop(1, '#81e0ff');    // Vibrant cyan at bottom-right
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle radial bright highlight in center
    var radGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.6);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    radGrad.addColorStop(0.5, 'rgba(240, 250, 255, 0.7)');
    radGrad.addColorStop(1, 'rgba(124, 228, 255, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Interactive Parallax & Physics for Grid Nodes
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.pulse += n.pulseSpeed;

      var dx = mouse.x - n.baseX;
      var dy = mouse.y - n.baseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var maxDist = 280;

      // Parallax mouse displacement (moves with mouse fluidly)
      if (dist < maxDist && dist > 1) {
        var force = (1 - dist / maxDist) * 24;
        n.x = n.baseX - (dx / dist) * force;
        n.y = n.baseY - (dy / dist) * force;
      } else {
        n.x += (n.baseX - n.x) * 0.06;
        n.y += (n.baseY - n.y) * 0.06;
      }
    }

    // 3. Draw Hexagonal Grid Lines (Clean Tech Blue #0099cc / #0088cc)
    ctx.lineWidth = 1.1;
    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      var p1 = edge.a;
      var p2 = edge.b;

      var lineAlpha = (p1.baseAlpha + p2.baseAlpha) * 0.5;

      // Proximity glow to cursor
      var midX = (p1.x + p2.x) * 0.5;
      var midY = (p1.y + p2.y) * 0.5;
      var mdx = mouse.x - midX;
      var mdy = mouse.y - midY;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 220) {
        lineAlpha = Math.min(0.9, lineAlpha + (1 - mdist / 220) * 0.45);
        ctx.strokeStyle = 'rgba(0, 140, 215, ' + lineAlpha.toFixed(3) + ')';
        ctx.lineWidth = 1.4;
      } else {
        ctx.strokeStyle = 'rgba(0, 160, 230, ' + lineAlpha.toFixed(3) + ')';
        ctx.lineWidth = 1.0;
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // 4. Draw Hexagon Joint Tech Dots (like in the reference photo)
    for (var k = 0; k < nodes.length; k++) {
      var nd = nodes[k];
      if (nd.hasDot) {
        var dAlpha = Math.min(0.95, nd.baseAlpha + Math.sin(nd.pulse) * 0.15);
        var curRadius = nd.dotRadius;

        // Mouse reaction expands and highlights dots
        var ddx = mouse.x - nd.x;
        var ddy = mouse.y - nd.y;
        var ddist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (ddist < 180) {
          dAlpha = Math.min(1, dAlpha + (1 - ddist / 180) * 0.4);
          curRadius *= 1.35;
        }

        ctx.fillStyle = 'rgba(0, 145, 230, ' + dAlpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, curRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner halo for bigger nodes
        if (nd.dotRadius > 2.5) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // 5. Draw Free Floating Tech/Lab Particles
    for (var f = 0; f < freeParticles.length; f++) {
      var fp = freeParticles[f];
      fp.x += fp.vx;
      fp.y += fp.vy;

      if (fp.x < -10) fp.x = w + 10;
      if (fp.x > w + 10) fp.x = -10;
      if (fp.y < -10) fp.y = h + 10;
      if (fp.y > h + 10) fp.y = -10;

      // Mouse repulse
      var fdx = mouse.x - fp.x;
      var fdy = mouse.y - fp.y;
      var fdist = Math.sqrt(fdx * fdx + fdy * fdy);
      if (fdist < 150 && fdist > 1) {
        var fforce = (1 - fdist / 150) * 1.5;
        fp.x -= (fdx / fdist) * fforce;
        fp.y -= (fdy / fdist) * fforce;
      }

      ctx.fillStyle = 'rgba(0, 160, 235, ' + fp.alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, fp.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
