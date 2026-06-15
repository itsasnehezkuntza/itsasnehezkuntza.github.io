// Taupada Akademia — panel page logic
// Migrated from the Wix HTML block to GitHub Pages.

let toastTimer = null;

  function showLockedMessage() {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.classList.add("show");

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(function() {
      toast.classList.remove("show");
    }, 3200);
  }
