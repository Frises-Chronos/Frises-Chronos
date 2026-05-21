function exportBIN() {
  const data = {
    version: 1,
    title: document.getElementById("title").value,
    events
  };

  const blob = new Blob([JSON.stringify(data)], {
    type: "application/octet-stream"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "frise.bin";
  a.click();
}

function exportPNG() {
  html2canvas(document.getElementById("timeline")).then(canvas => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "frise.png";
    a.click();
  });
}

function exportPDF() {
  html2canvas(document.getElementById("timeline")).then(canvas => {
    const img = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("landscape");

    pdf.addImage(img, "PNG", 10, 10, 280, 150);
    pdf.save("frise.pdf");
  });
}
