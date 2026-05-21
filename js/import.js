function importBIN(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);

    events = data.events || [];
    document.getElementById("title").value = data.title || "";

    render();
  };

  reader.readAsText(file);
}
