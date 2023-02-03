<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Stats from 'stats.js';

  import Style from './perf.less';

  let stats = null;
  let statsFrame = null;

  onMount(() => {
    Style.use();
  });

  onDestroy(() => {
    Style.unuse();
  });

  function openStats() {
    if (stats) {
      cancelAnimationFrame(statsFrame);
      stats.dom.parentNode.removeChild(stats.dom);
      stats = null;
    } else {
      stats = new Stats();
      stats.showPanel(0);
      const isMobile = 'ontouchstart' in window;
      if (isMobile) {
        let startX = 0;
        let startY = 0;
        let offsetX = 0;
        let offsetY = 0;
        stats.dom.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          offsetX = startX - stats.dom.offsetLeft;
          offsetY = startY - stats.dom.offsetTop;
        });
        stats.dom.addEventListener('touchmove', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const X = e.touches[0].clientX;
          const Y = e.touches[0].clientY;

          const x = Math.min(Math.max(X - offsetX, 0), window.innerWidth - stats.dom.offsetWidth);
          const y = Math.min(Math.max(Y - offsetY, 0), window.innerHeight - stats.dom.offsetHeight);

          stats.dom.style.left = x + 'px';
          stats.dom.style.top = y + 'px';
        });
      }

      const html = document.querySelector('html');
      html.appendChild(stats.dom);
      requestAnimationFrame(function loop() {
        stats.update();
        statsFrame = requestAnimationFrame(loop);
      });
    }
  }

  let isPauseLog = false;

  function pauseLog() {
    isPauseLog = !isPauseLog;
    let ev;
    if (isPauseLog) {
      ev = new Event('vconsole_log_pause');
      console.warn('Pause show console log');
    } else {
      ev = new Event('vconsole_log_restore');
      console.warn('Restore show console log');
    }
    document.dispatchEvent(ev);
  }
</script>

<div class="wrapper">
  <button class="btn" on:click={openStats}>{stats ? 'Open' : 'Close'} FPS monitor</button>
  <button class="btn" on:click={pauseLog}>{isPauseLog ? 'Restore' : 'Pause'} Log</button>
</div>
