import { VConsoleSveltePlugin } from '../lib/sveltePlugin';

import PerfComp from './perf.svelte';

export class VConsolePerfPlugin extends VConsoleSveltePlugin {
  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, PerfComp, renderProps);
  }

  public onShow() {
    console.log('onshow');
  }
}
