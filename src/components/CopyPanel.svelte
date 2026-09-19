<script lang="ts">
  import type { FormState } from '../lib/state.svelte';
  import Badge from './Badge.svelte';
  import Message from './Message.svelte';

  interface Props {
    form: FormState;
  }

  let { form }: Props = $props();

  async function copy() {
    const copied = await form.copySheet();
    if (copied === false) {
      alert(
        'Failed to copy content to clipboard\nIf you see this message, inform the Restless Pale staff in your application ticket channel!',
      );
    }
  }
</script>

<div class="panel">
  <div>
    {#if !form.isComplete}
      <Message variant="error">
        Before trying to copy, make sure to first fill out all the required fields above. You may
        choose to ignore fields with the <Badge kind="optional" /> tag or
        <Badge kind="warning" /> message.
      </Message>
    {/if}
    {#if form.copied}
      <Message variant="success">
        Success! You can now go back to Discord, to the channel where you found the link to this
        website, and paste the copied content there! A staff member will review it shortly.<br />
        Not sure how to paste your sheet? You can either right click and click 'Paste' in the Discord
        chat entry box, or simply press <Badge kind="instruction" label="CTRL" /> +
        <Badge kind="instruction" label="V" /> in there!
      </Message>
    {/if}

    <button id="copySheetButton" disabled={!form.isComplete} onclick={copy}>
      Generate & Copy Character Sheet
    </button>
  </div>
</div>

<style>
  .panel {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  button {
    margin-top: 0.5em;
    padding-left: 1em;
    padding-right: 1em;
    border-color: var(--color-ok);
    font-size: 1.5em;
    color: var(--color-ok);
    transition: box-shadow 0.25s;
  }

  button:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(49, 196, 141, 0.5);
  }

  button:disabled {
    border: none;
    color: rgb(82, 82, 82);
  }
</style>
