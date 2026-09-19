<script lang="ts">
  import Badge from './Badge.svelte';
  import Message from './Message.svelte';
</script>

<div class="logo">
  <img src="{import.meta.env.BASE_URL}rp_logo.png" alt="Restless Pale logo" height="100" />
</div>

<Message variant="info">
  <b>Welcome!</b><br />
  This is the <b>Restless Pale</b> Character Sheet Formatter. This tool has been designed to help
  you make your character sheet, and to ultimately make the character application process be more
  efficient for you as a new player and the staff alike. Take your time to fill out the details.
  Once you've filled out all the fields, you will be able to click the
  <Badge kind="instruction" label="Generate & Copy Character Sheet" /> button at the very bottom of this
  page. It will give you your next instructions!<br />
</Message>

<Message variant="info">
  <Badge kind="optional" /> This tag means you may choose to fill out the specified field, or leave it
  blank!<br /><br />
  <Badge kind="warning" /> Orange warning messages are there to give you contextual info. You do not need
  to resolve them to be able to copy your sheet.<br /><br />
  <Badge kind="error" /> Red error messages indicate a problem with your sheet. Resolve the issue to be
  able to copy your sheet!<br />
</Message>

<style>
  .logo {
    text-align: center;
  }
</style>
