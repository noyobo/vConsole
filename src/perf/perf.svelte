<script lang="ts">
  import { onDestroy, onMount, createEventDispatcher } from 'svelte';
  import Stats from 'stats.js';

  import Styles from './perf.module.less';

  export let stats = null;

  let statsFrame = null;
  export const panels: Record<string, Stats.Panel> = {};

  onMount(() => {
    Styles.use();
  });

  onDestroy(() => {
    Styles.unuse();
  });

  // css Module
  const stylesModule = Styles.locals;

  const dispatch = createEventDispatcher();

  function openStats() {
    if (stats) {
      cancelAnimationFrame(statsFrame);
      stats.dom.parentNode.removeChild(stats.dom);
      stats = null;
      panels.messageTime = null;
    } else {
      stats = new Stats();
      // message channel 统计消息通道的耗时
      const messageTime = new Stats.Panel('MT', '#a9f', '#002');
      stats.addPanel(messageTime);
      panels.messageTime = messageTime;

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

      stats.dom.style.top = '50px';
    }

    dispatch('stats_toggle', { show: !!stats });
  }

  let isPauseLog = false;

  function toggleLog() {
    isPauseLog = !isPauseLog;
    let ev;
    if (isPauseLog) {
      ev = new Event('vconsole_log_pause', { bubbles: true });
    } else {
      ev = new Event('vconsole_log_restore', { bubbles: true });
    }
    console.warn('[vConsole] Toggle log');
    document.dispatchEvent(ev);
    dispatch('log_toggle', { pause: isPauseLog });
  }
</script>

<div class={stylesModule.wrapper}>
  <button class={stylesModule.btn} on:click={openStats}>{stats ? 'Close' : 'Open'} FPS monitor</button>
  <button class={stylesModule.btn} on:click={toggleLog}>Toggle log</button>
</div>
