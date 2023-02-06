import { VConsoleSveltePlugin } from '../lib/sveltePlugin';

import Stats from 'stats.js';
import PerfComp from './perf.svelte';

export class VConsolePerfPlugin extends VConsoleSveltePlugin {
  private offHide: () => void;
  private offLog: () => void;
  private isInited: any;

  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, PerfComp, renderProps);
  }

  public onShow() {
    if (this.isInited) {
      return;
    }
    this.isInited = true;

    this.offHide = this.compInstance.$on('stats_toggle', () => {
      this.vConsole.hide();
    });

    this.offLog = this.compInstance.$on('log_toggle', () => {
      this.vConsole.showPlugin('default');
    });
  }

  public onRemove() {
    super.onRemove();
    this.offHide && this.offHide();
    this.offLog && this.offLog();
  }
}
