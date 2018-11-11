import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';

import { componentName } from '@/util';

@Component({ name: componentName('input-group') })
export class InputGroup extends Vue {
  @Prop({ type: String, required: false, default: null }) public before!: string | null;
  @Prop({ type: String, required: false, default: null }) public after!: string | null;
  @Prop({ type: String, required: false, default: null }) public afterClass!: string | null;

  public render() {
    const beforeAddon = this.before || this.$slots.before;
    const afterAddon = this.after || this.$slots.after;
    const afterClass = this.afterClass || '';
    const ws = this.afterClass ? ' ' : '';
    const afterAddonClassName = 'fd-input-group__addon fd-input-group__addon--after' + ws + afterClass;
    return (
      <div class={this.classes}>
        {beforeAddon && <span class='fd-input-group__addon fd-input-group__addon--before'>{beforeAddon}</span>}
        {this.$slots.default}
        {afterAddon && <span class={afterAddonClassName}>{afterAddon}</span>}
      </div>
    );
  }

  private get classes() {
    return {
      'fd-input-group': true,
      'fd-input-group--before': this.before || this.$slots.before,
      'fd-input-group--after': this.after || this.$slots.after,
    };
  }
}