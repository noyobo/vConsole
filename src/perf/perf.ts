import { VConsoleSveltePlugin } from '../lib/sveltePlugin';

import PerfComp from './perf.svelte';

export class VConsolePerfPlugin extends VConsoleSveltePlugin {
  private offHide: () => void;
  private offLog: () => void;

  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, PerfComp, renderProps);
  }

  public onShow() {
    this.offHide = this.compInstance.$on('stats_toggle', () => {
      this.vConsole.hide();
    });

    this.offLog = this.compInstance.$on('log_toggle', (log) => {
      this.vConsole.showPlugin('default');
    });
  }

  public onHide() {
    this.offHide();
    this.offLog();
  }
}
