<script lang="ts">
  import CopyPanel from './components/CopyPanel.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import Section from './components/Section.svelte';
  import { TOTAL_MAX_LENGTH, sections } from './lib/fields';
  import { FormState } from './lib/state.svelte';

  const form = new FormState();

  function reset() {
    if (
      window.confirm(
        "Are you sure you want to reset all the values? You won't be able to get them back!",
      )
    ) {
      form.reset();
    }
  }
</script>

<main>
  {#if form.sheetLength > TOTAL_MAX_LENGTH}
    <p>
      The total number of symbols on your sheet exceeds the Discord message limit ({TOTAL_MAX_LENGTH}
      symbols). Please reduce this by reducing the text in any of the text fields, else Discord won't
      let you post your message.
    </p>
  {/if}

  <InfoPanel />

  <button id="resetSheetButton" onclick={reset}>Reset all values!</button>

  {#each sections as section (section.id)}
    <Section {section} {form} />
  {/each}

  <CopyPanel {form} />
</main>

<style>
  #resetSheetButton {
    margin-bottom: 1em;
  }
</style>
