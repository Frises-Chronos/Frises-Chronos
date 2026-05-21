// import.js
// Permet d’importer un projet .bin contenant du JSON lisible.

function validateProjectData(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version !== 1) return false;
  if (!Array.isArray(data.events)) return false;
  if (typeof data.timelineName !== 'string') return false;
  if (typeof data.settings !== 'object') return false;
  return true;
}

function importProjectFile(file) {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const content = event.target.result;
      const parsed = JSON.parse(content);

      if (!validateProjectData(parsed)) {
        window.frisesChronos?.showToast?.('Fichier .bin invalide.');
        return;
      }

      window.frisesChronos?.applyImportedProject?.(parsed);
      window.frisesChronos?.showToast?.('Projet chargé avec succès.');

    } catch (error) {
      console.error(error);
      window.frisesChronos?.showToast?.('Impossible de lire le fichier .bin.');
    }
  };

  reader.readAsText(file, 'utf-8');
}

function setupImportButton() {
  const fileInput = document.getElementById('projectFile');
  const loadBtn = document.getElementById('loadProjectBtn');

  if (!fileInput || !loadBtn) return;

  loadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importProjectFile(file);
    fileInput.value = '';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupImportButton();
});
