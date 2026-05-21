// timeline.js
// Gère la timeline visuelle, les événements et l’interface de l’éditeur.

window.chronoNova = {
  projectState: {
    version: 1,
    timelineName: 'Histoire de France',
    settings: {
      theme: 'dark',
      zoom: 1,
    },
    events: [
      {
        id: 1,
        date: 1789,
        title: 'Révolution française',
        description: 'Début de la Révolution et prise de la Bastille.',
        color: '#3b82f6',
      },
      {
        id: 2,
        date: 1969,
        title: 'Première mission lunaire',
        description: 'Apollo 11 pose le premier homme sur la Lune.',
        color: '#8b5cf6',
      },
    ],
  },
  selectedEventId: null,
  timeline: null,
  items: null,
  dom: {},
};

function formatDateForTimeline(year) {
  const parsedYear = Number(year) || 0;
  return new Date(parsedYear, 0, 1);
}

function createTimelineItem(event) {
  return {
    id: event.id,
    content: `<div class="timeline-badge" style="background:${event.color};">${event.date}</div><strong>${event.title}</strong>`,
    start: formatDateForTimeline(event.date),
    type: 'point',
    style: `border-color: ${event.color}; background: rgba(255,255,255,0.04); color: #fff;`,
    title: event.description,
  };
}

function sortEvents() {
  window.chronoNova.projectState.events.sort((a, b) => a.date - b.date);
}

function updateZoomLabel() {
  const label = document.getElementById('zoomLevel');
  if (label) {
    label.textContent = `${Math.round(window.chronoNova.projectState.settings.zoom * 100)}%`;
  }
}

function renderTimeline() {
  const timelineContainer = document.getElementById('timelineContainer');
  if (!timelineContainer) return;

  sortEvents();
  const items = window.chronoNova.projectState.events.map(createTimelineItem);

  if (!window.chronoNova.items) {
    window.chronoNova.items = new vis.DataSet(items);
  } else {
    window.chronoNova.items.clear();
    window.chronoNova.items.add(items);
  }

  const options = {
    stack: false,
    zoomable: true,
    moveable: true,
    showCurrentTime: false,
    selectable: true,
    multiselect: false,
    editable: false,
    orientation: 'top',
    maxHeight: 520,
    margin: { item: 20, axis: 18 },
    zoomMin: 1000 * 60 * 60 * 24 * 365 * 5,
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 2400,
    horizontalScroll: true,
    verticalScroll: false,
    zoomKey: 'ctrlKey',
  };

  if (!window.chronoNova.timeline) {
    window.chronoNova.timeline = new vis.Timeline(timelineContainer, window.chronoNova.items, options);
    window.chronoNova.timeline.on('select', ({ items }) => {
      if (items.length > 0) {
        selectEvent(Number(items[0]));
      }
    });
    timelineContainer.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const factor = event.deltaY > 0 ? 1.14 : 0.86;
        adjustZoom(factor);
      }
    }, { passive: false });
  } else {
    window.chronoNova.timeline.setItems(window.chronoNova.items);
  }

  const startYear = Math.min(...window.chronoNova.projectState.events.map((e) => e.date), 0);
  const endYear = Math.max(...window.chronoNova.projectState.events.map((e) => e.date), 2100);
  window.chronoNova.timeline.setWindow(new Date(startYear - 20, 0, 1), new Date(endYear + 20, 0, 1));
  updateZoomLabel();
}

function renderEventList(filter = '') {
  const list = document.getElementById('eventList');
  if (!list) return;
  list.innerHTML = '';

  const events = window.chronoNova.projectState.events.filter((event) => {
    const query = filter.trim().toLowerCase();
    if (!query) return true;
    return event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query) || String(event.date).includes(query);
  });

  if (events.length === 0) {
    list.innerHTML = '<p class="empty-state">Aucun événement trouvé.</p>';
    return;
  }

  events.forEach((event) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'event-card';
    card.dataset.id = event.id;
    if (window.chronoNova.selectedEventId === event.id) {
      card.classList.add('active');
    }
    card.innerHTML = `<strong>${event.title}</strong><time>${event.date}</time><p>${event.description}</p>`;
    card.addEventListener('click', () => selectEvent(event.id));
    list.appendChild(card);
  });
}

function selectEvent(eventId) {
  const event = window.chronoNova.projectState.events.find((item) => item.id === eventId);
  if (!event) return;
  window.chronoNova.selectedEventId = eventId;
  fillEventForm(event);
  renderEventList(document.getElementById('searchInput')?.value || '');
  if (window.chronoNova.timeline) {
    window.chronoNova.timeline.setSelection(eventId, { focus: false });
  }
}

function fillEventForm(event) {
  const titleInput = document.getElementById('eventTitle');
  const dateInput = document.getElementById('eventDate');
  const descriptionInput = document.getElementById('eventDescription');
  const colorInput = document.getElementById('eventColor');
  if (!titleInput || !dateInput || !descriptionInput || !colorInput) return;
  titleInput.value = event.title;
  dateInput.value = event.date;
  descriptionInput.value = event.description;
  colorInput.value = event.color;
}

function createNewEvent() {
  const newEvent = {
    id: Date.now(),
    date: new Date().getFullYear(),
    title: 'Nouvel événement',
    description: 'Description rapide de l’événement.',
    color: '#3b82f6',
  };
  window.chronoNova.projectState.events.push(newEvent);
  selectEvent(newEvent.id);
  renderTimeline();
  saveCurrentProject();
  window.chronoNova.showToast('Événement ajouté.');
}

function updateSelectedEvent() {
  const event = window.chronoNova.projectState.events.find((item) => item.id === window.chronoNova.selectedEventId);
  if (!event) {
    window.chronoNova.showToast('Aucun événement sélectionné.');
    return;
  }

  const titleInput = document.getElementById('eventTitle');
  const dateInput = document.getElementById('eventDate');
  const descriptionInput = document.getElementById('eventDescription');
  const colorInput = document.getElementById('eventColor');

  event.title = titleInput.value || event.title;
  event.date = Number(dateInput.value) || event.date;
  event.description = descriptionInput.value || event.description;
  event.color = colorInput.value || event.color;

  renderTimeline();
  renderEventList(document.getElementById('searchInput')?.value || '');
  saveCurrentProject();
  window.chronoNova.showToast('Événement mis à jour.');
}

function deleteSelectedEvent() {
  const eventId = window.chronoNova.selectedEventId;
  if (!eventId) {
    window.chronoNova.showToast('Aucun événement sélectionné.');
    return;
  }
  window.chronoNova.projectState.events = window.chronoNova.projectState.events.filter((item) => item.id !== eventId);
  window.chronoNova.selectedEventId = null;
  if (window.chronoNova.projectState.events.length > 0) {
    selectEvent(window.chronoNova.projectState.events[0].id);
  } else {
    renderEventList('');
  }
  renderTimeline();
  saveCurrentProject();
  window.chronoNova.showToast('Événement supprimé.');
}

function adjustZoom(factor) {
  const timeline = window.chronoNova.timeline;
  if (!timeline) return;
  const range = timeline.getWindow();
  const start = range.start.valueOf();
  const end = range.end.valueOf();
  const center = (start + end) / 2;
  const newRange = Math.max(1000 * 60 * 60 * 24 * 365, (end - start) * factor);
  const windowStart = new Date(center - newRange / 2);
  const windowEnd = new Date(center + newRange / 2);
  timeline.setWindow(windowStart, windowEnd, { animation: { duration: 180, easingFunction: 'easeInOutQuad' } });
  window.chronoNova.projectState.settings.zoom = Math.min(4, Math.max(0.3, window.chronoNova.projectState.settings.zoom * factor));
  updateZoomLabel();
  saveCurrentProject();
}

function saveCurrentProject() {
  ChronoNovaStorage.saveProject(window.chronoNova.projectState);
}

function bindTimelineEvents() {
  const addEventBtn = document.getElementById('addEventBtn');
  const updateEventBtn = document.getElementById('updateEventBtn');
  const deleteEventBtn = document.getElementById('deleteEventBtn');
  const searchInput = document.getElementById('searchInput');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');

  if (addEventBtn) {
    addEventBtn.addEventListener('click', createNewEvent);
  }
  if (updateEventBtn) {
    updateEventBtn.addEventListener('click', updateSelectedEvent);
  }
  if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', deleteSelectedEvent);
  }
  if (searchInput) {
    searchInput.addEventListener('input', () => renderEventList(searchInput.value));
  }
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => adjustZoom(0.82));
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => adjustZoom(1.22));
  }
}

function applyProjectName() {
  const title = document.getElementById('timelineName');
  if (title) {
    title.textContent = window.chronoNova.projectState.timelineName || 'ChronoNova';
  }
}

function applyImportedProject(project) {
  window.chronoNova.projectState = project;
  window.chronoNova.selectedEventId = project.events.length > 0 ? project.events[0].id : null;
  renderTimeline();
  renderEventList('');
  applyProjectName();
  saveCurrentProject();
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function initTimelineEditor() {
  const stored = ChronoNovaStorage.loadProject();
  if (stored && validateLoadedProject(stored)) {
    window.chronoNova.projectState = stored;
  }
  applyProjectName();
  renderTimeline();
  renderEventList('');
  bindTimelineEvents();
  if (window.chronoNova.projectState.events.length > 0 && !window.chronoNova.selectedEventId) {
    selectEvent(window.chronoNova.projectState.events[0].id);
  }
  applyThemeFromSettings();
}

function validateLoadedProject(project) {
  if (!project || typeof project !== 'object') return false;
  if (!Array.isArray(project.events)) return false;
  if (typeof project.timelineName !== 'string') return false;
  if (!project.settings || typeof project.settings.zoom !== 'number') return false;
  return true;
}

function applyThemeFromSettings() {
  const theme = window.chronoNova.projectState.settings.theme || 'dark';
  document.body.dataset.theme = theme;
}

window.chronoNova.applyImportedProject = applyImportedProject;
window.chronoNova.showToast = showToast;
window.chronoNova.saveCurrentProject = saveCurrentProject;
window.chronoNova.applyThemeFromSettings = applyThemeFromSettings;

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('timelineContainer')) {
    initTimelineEditor();
  }
});
