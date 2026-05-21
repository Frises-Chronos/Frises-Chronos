let events = [];
let selectedId = null;

let zoom = 1;

const timeline = document.getElementById("timeline");
const zoomInput = document.getElementById("zoom");

const PIXEL_PER_YEAR = 2;
const OFFSET = 5000;
const SNAP = 1; // snap 1 année

/* ADD EVENT */
function addEvent() {
  const date = Number(document.getElementById("date").value);
  const title = document.getElementById("eventTitle").value;
  const desc = document.getElementById("desc").value;

  if (!date || !title) {
    alert("Remplis date + titre");
    return;
  }

  events.push({
    id: Date.now(),
    date,
    title,
    description: desc
  });

  render();
}

/* SNAP */
function snap(year) {
  return Math.round(year / SNAP) * SNAP;
}

/* RENDER */
function render() {
  timeline.innerHTML = "";

  const line = document.createElement("div");
  line.className = "line";
  timeline.appendChild(line);

  drawYears();

  events.sort((a,b) => a.date - b.date);

  events.forEach(e => {

    const x = (e.date * PIXEL_PER_YEAR * zoom) + OFFSET;

    const div = document.createElement("div");
    div.className = "event";
    div.style.left = x + "px";

    div.innerHTML = `<b>${e.date}</b><br>${e.title}`;

    div.onclick = () => selectEvent(e.id);

    /* DRAG */
    let drag = false;

    div.onmousedown = () => drag = true;
    document.onmouseup = () => drag = false;

    document.onmousemove = (ev) => {
      if (!drag) return;

      const newYear = (ev.pageX - OFFSET) / (PIXEL_PER_YEAR * zoom);
      e.date = snap(newYear);

      render();
    };

    timeline.appendChild(div);
  });
}

/* YEARS GRID */
function drawYears() {
  for (let y = -500; y <= 2050; y += 50) {

    const x = (y * PIXEL_PER_YEAR * zoom) + OFFSET;

    const div = document.createElement("div");
    div.className = "year";
    div.style.left = x + "px";
    div.innerText = y;

    timeline.appendChild(div);
  }
}

/* ZOOM */
zoomInput.addEventListener("input", (e) => {
  zoom = Number(e.target.value);
  render();
});

render();
