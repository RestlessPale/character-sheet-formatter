<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant: 'error' | 'alert' | 'success' | 'info';
    /** Adds the vertical spacing a paragraph would have, for messages placed below a field. */
    spaced?: boolean;
    children: Snippet;
  }

  let { variant, spaced = false, children }: Props = $props();
</script>

<div class="message {variant}" class:spaced>
  <div>{@render children()}</div>
</div>

<style>
  .message {
    display: flex;
    align-items: center;
    padding: 0.25rem;
    border: 1px solid var(--tone);
    border-radius: var(--radius-box);
    background-color: var(--color-surface);
    color: var(--tone);
    fill: var(--tone);
    font-size: 0.9rem;
    font-weight: 600;
    text-align: left;
  }

  .message::before {
    content: '';
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    margin: 0.25rem;
    background-color: var(--tone);
    -webkit-mask: var(--icon) no-repeat 50% 50%;
    mask: var(--icon) no-repeat 50% 50%;
    -webkit-mask-size: cover;
    mask-size: cover;
  }

  .spaced {
    margin: 1em 0;
  }

  .alert {
    --tone: var(--color-warn);
    --icon: url('../assets/warning.svg');
  }

  .error {
    --tone: var(--color-error);
    --icon: url('../assets/warning.svg');
  }

  .success {
    --tone: var(--color-ok);
    --icon: url('../assets/warning.svg');
  }

  .info {
    --tone: var(--color-accent);
    --icon: url('../assets/info.svg');
    margin-bottom: 1em;
  }
</style>
