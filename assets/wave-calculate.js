(function() {
      let container = document.body;
      let width = container.offsetWidth;
      let height = container.offsetHeight;
      let waves = document.querySelectorAll('.wave_path');
  
      let waveWidth = container.offsetWidth;  // Wave SVG width (usually container width)    
      let waveHeight = 100;                   // Position from the top of container
      var waveDelta = 10;                     // Wave amplitude
      var speed = 0.2;                        // Wave animation speed
      var wavePoints = 6;                     // How many point will be used to compute our wave
  
      var points = [];

      function setNewWindowSize() {
        container = document.body;
        width = container.offsetWidth;
        height = container.offsetHeight;
        waveWidth = container.offsetWidth;
      }
      
      function calculateWavePoints(factor) {
        var points = [];
  
        for (var i = 0; i <= wavePoints; i++) {
          let x = i / wavePoints * waveWidth;
          let sinSeed = (factor + (i + i % wavePoints)) * speed * 100;
          let sinHeight = Math.sin(sinSeed / 100) * waveDelta;
          let yPos = Math.sin(sinSeed / 100) * sinHeight + waveHeight;
          points.push({ x: x, y: yPos });
        }
  
        return points;
      }
  
      function buildPath(points) {
        let SVGString = 'M ' + points[0].x + ' ' + points[0].y;
  
        let cp0 = {
          x: (points[1].x - points[0].x) / 2,
          y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
        };
  
        SVGString += ' C ' + cp0.x + ' ' + cp0.y + ' ' + cp0.x + ' ' + cp0.y + ' ' + points[1].x + ' ' + points[1].y;
  
        let prevCp = cp0;
        let inverted = -1;
  
        for (var i = 1; i < points.length - 1; i++) {
          let cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
          let cp1 = {
            x: (points[i].x - prevCp.x) + points[i].x,
            y: (points[i].y - prevCp.y) + points[i].y
          };
  
          SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i + 1].x + ' ' + points[i + 1].y;
          prevCp = cp1;
          inverted = -inverted;
        };
  
        SVGString += ' L ' + width + ' ' + height;
        SVGString += ' L 0 ' + height + ' Z';
        return SVGString;
      }
  
      var lastUpdate;
      var totalTime = 0;
  
      function tick() {
        var now = window.Date.now();
  
        if (lastUpdate) {
          let elapsed = (now - lastUpdate) / 1000;
          lastUpdate = now;
  
          totalTime += elapsed;
  
          let factor = totalTime * Math.PI;
          waves.forEach(function(wave) {
            wave.setAttribute('d', buildPath(calculateWavePoints(factor)));
          })
        } else {
          lastUpdate = now;
        }

        window.requestAnimationFrame(tick);
      };
      tick();
      window.addEventListener('DOMContentLoaded', setNewWindowSize);
      window.addEventListener('resize', setNewWindowSize);
    })(); 