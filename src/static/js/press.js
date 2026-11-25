/* Press page: copy buttons for the descriptions. */
(function () {
  if (!navigator.clipboard) return;
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.hidden = false;
    const label = button.textContent;
    button.addEventListener("click", async () => {
      const source = button.parentElement.querySelector("[data-copy-source]");
      try {
        await navigator.clipboard.writeText(source.innerText.trim());
        button.textContent = "✓";
        setTimeout(() => (button.textContent = label), 1500);
      } catch (e) { /* clipboard refused: the text is still selectable */ }
    });
  });
})();
