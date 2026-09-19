<script lang="ts">
  import { fields, type Section } from '../lib/fields';
  import type { FormState } from '../lib/state.svelte';
  import Field from './Field.svelte';

  interface Props {
    section: Section;
    form: FormState;
  }

  let { section, form }: Props = $props();
</script>

<div id={section.id} class="section">
  <h2>{section.title}</h2>
  <hr />
  {#each section.rows as row, rowIndex (rowIndex)}
    <div
      class="row"
      class:single={row.columns.length === 1}
      style:--columns={row.columns.join(' ')}
    >
      {#each row.fields as id (id)}
        <div class="cell"><Field field={fields[id]} {form} /></div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .section {
    margin-bottom: 2vw;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-section);
    background-color: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(6px);
  }

  h2 {
    margin-left: 10px;
    color: white;
    text-align: center;
  }

  hr {
    width: 90%;
    margin: 0 auto 1em;
    color: rgba(255, 255, 255, 0.25);
  }

  .cell {
    box-sizing: border-box;
    padding: 5px;
  }

  .single .cell {
    padding: 10px;
  }

  /* Small fields share a row: two per row on tablets, the full column layout on desktop. */
  @media screen and (min-width: 600px) {
    .row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    .row.single {
      grid-template-columns: 1fr;
    }

    .cell {
      padding: 10px;
    }
  }

  @media screen and (min-width: 1100px) {
    .row {
      grid-template-columns: var(--columns);
    }
  }

  @media screen and (max-width: 1900px) {
    .section {
      margin-bottom: 8vw;
    }

    h2 {
      margin-left: 5px;
    }
  }
</style>
