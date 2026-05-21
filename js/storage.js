// storage.js
// Gestion des sauvegardes automatiques sur le navigateur avec localStorage.

const ChronoNovaStorage = (() => {
  const KEY = 'chrononova-autosave';

  function saveProject(project) {
    try {
      localStorage.setItem(KEY, JSON.stringify(project));
      return true;
    } catch (error) {
      console.error('Impossible de sauvegarder le projet:', error);
      return false;
    }
  }

  function loadProject() {
    try {
      const serialized = localStorage.getItem(KEY);
      if (!serialized) {
        return null;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Impossible de charger le projet:', error);
      return null;
    }
  }

  function clearProject() {
    localStorage.removeItem(KEY);
  }

  return {
    saveProject,
    loadProject,
    clearProject,
  };
})();
