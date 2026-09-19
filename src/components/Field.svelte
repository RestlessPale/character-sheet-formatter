<script lang="ts">
  import type { Field } from '../lib/fields';
  import type { FormState } from '../lib/state.svelte';
  import { containsAnyTerm, formatError, isAgeTooLow } from '../lib/validation';
  import Badge from './Badge.svelte';
  import Message from './Message.svelte';

  interface Props {
    field: Field;
    form: FormState;
  }

  let { field, form }: Props = $props();

  const controlId = $derived(`${field.htmlId}${field.kind === 'textarea' ? 'TextArea' : 'Input'}`);
  const showError = $derived(
    field.kind === 'number' ? isAgeTooLow(form.values.age, field) : !!form.flagged[field.id],
  );
  const alerts = $derived(
    field.kind === 'text' || field.kind === 'textarea'
      ? (field.termAlerts ?? []).filter((alert) =>
          containsAnyTerm(form.values[field.id], alert.terms),
        )
      : [],
  );
</script>

<div id={field.htmlId} class="field">
  <label id="{field.htmlId}Label" for={controlId}
    ><b class="title">{field.title}</b>{#if field.optional}<Badge kind="optional" />{/if}</label
  ><br />

  {#if field.kind === 'text'}
    <input
      id={controlId}
      type="text"
      placeholder={field.placeholder}
      maxlength={field.max}
      bind:value={() => form.values[field.id], (value) => form.setText(field.id, value)}
      onfocusout={() => form.blur(field.id)}
    />
  {:else if field.kind === 'textarea'}
    <textarea
      id={controlId}
      placeholder={field.placeholder}
      maxlength={field.max}
      style:--textarea-height={field.textareaHeight}
      bind:value={() => form.values[field.id], (value) => form.setText(field.id, value)}
      onfocusout={() => form.blur(field.id)}
    ></textarea>
  {:else if field.kind === 'number'}
    <input
      id={controlId}
      type="number"
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      bind:value={() => form.values.age, (value) => form.setAge(value)}
      onchange={() => form.commitAge()}
    />
  {:else if field.kind === 'select'}
    <select
      id={controlId}
      bind:value={() => form.values[field.id], (value) => form.setText(field.id, value)}
      onfocusout={() => form.blur(field.id)}
    >
      {#if field.optional}<option value=""></option>{/if}
      {#each field.choices.groups ?? [] as group (group.label)}
        <optgroup label={group.label}>
          {#each group.options as option (option.value)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </optgroup>
      {/each}
      {#each field.choices.options ?? [] as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {/if}

  {#if field.kind === 'text' || field.kind === 'textarea'}
    <div class="charcount">{form.values[field.id].length}/{field.max}</div>
  {/if}

  {#if showError}
    <Message variant="error" spaced>
      {#each formatError(field) as line, index (index)}
        {#if index > 0}<br />{/if}{line}
      {/each}
    </Message>
  {/if}

  {#each alerts as alert (alert.message)}
    <Message variant="alert" spaced>{alert.message}</Message>
  {/each}
</div>

<style>
  .field {
    display: flow-root;
  }

  label b {
    color: white;
  }

  .charcount {
    float: right;
    margin-top: -26px;
    margin-bottom: 5px;
    padding: 0.1rem 5px 0 0;
    font-size: 0.75rem;
  }
</style>
