<script lang="ts">
  interface Props {
    kind: 'optional' | 'warning' | 'error' | 'instruction';
    /** Text of the badge. Defaults to a label matching the kind. */
    label?: string;
  }

  const defaultLabels = {
    optional: 'Optional',
    warning: 'Warning',
    error: 'Error',
    instruction: '',
  } as const;

  let { kind, label = defaultLabels[kind] }: Props = $props();
</script>

<span class="badge {kind}" title={kind === 'instruction' ? label : undefined}>{label}</span>

<style>
  .badge {
    margin: 0 5px;
    padding: 2px 7px;
    border: 1px solid var(--tone);
    border-radius: var(--radius-box);
    background-color: var(--color-surface-badge);
    color: var(--tone);
    font-size: 0.7rem;
    text-align: center;
  }

  .optional {
    --tone: var(--color-ok);
  }

  .instruction {
    --tone: var(--color-muted);
  }

  .warning {
    --tone: var(--color-warn);
  }

  .error {
    --tone: var(--color-error);
  }
</style>
