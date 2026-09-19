/** Copies text to the clipboard, falling back to `execCommand` on browsers without the async API. */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  copyWithExecCommand(text);
}

function copyWithExecCommand(text: string): void {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  try {
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999); // mobile
    document.execCommand('copy');
  } finally {
    document.body.removeChild(dummy);
  }
}
