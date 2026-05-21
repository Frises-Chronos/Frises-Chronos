// export.js
// Gestion de l’export .bin, PNG et PDF du projet.

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportProjectToBin(project) {
  const content = JSON.stringify(project, null, 2);
  const blob = new Blob([content], { type: 'application/octet-stream' });
  downloadBlob(blob, `${project.timelineName || 'frises-chronos-project'}.bin`);
}

function exportTimelinePNG() {
  const timelineElement = document.getElementById('timelineContainer');
  if (!timelineElement) return;

  window.html2canvas(timelineElement, {
    backgroundColor: '#0f1117',
    scrollY: -window.scrollY,
    scale: 2,
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, 'frises-chronos-timeline.png');
    });
  }).catch((error) => {
    console.error(error);
    window.frisesChronos?.showToast?.('Erreur lors de l’export PNG.');
  });
}

async function exportTimelinePDF() {
  const timelineElement = document.getElementById('timelineContainer');
  if (!timelineElement) return;

  try {
    const canvas = await window.html2canvas(timelineElement, {
      backgroundColor: '#0f1117',
      scrollY: -window.scrollY,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const width = canvas.width * ratio;
    const height = canvas.height * ratio;

    pdf.addImage(imgData, 'PNG', 20, 20, width - 40, height - 40);
    pdf.save('frises-chronos-timeline.pdf');

  } catch (error) {
    console.error(error);
    window.frisesChronos?.showToast?.('Erreur lors de l’export PDF.');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const exportPngBtn = document.getElementById('exportPngBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const saveProjectBtn = document.getElementById('saveProjectBtn');

  if (exportPngBtn) {
    exportPngBtn.addEventListener('click', exportTimelinePNG);
  }

  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', exportTimelinePDF);
  }

  if (saveProjectBtn) {
    saveProjectBtn.addEventListener('click', () => {
      if (!window.frisesChronos) return;

      const success = ChronoNovaStorage.saveProject(window.frisesChronos.projectState);

      if (success) {
        window.frisesChronos.showToast('Projet sauvegardé localement.');
      }
    });
  }
});}
