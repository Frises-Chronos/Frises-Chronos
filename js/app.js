let events = [];
let selectedId = null;
let zoom = 1;

const timeline = document.getElementById("timeline");
const list = document.getElementById("list");

function addEvent() {
  const date = document.getElementById("date").value;
  const title = document.getElementById("eventTitle").value;
  const desc = document.getElementById("desc").value;

  if (!date || !title) {
    alert("Veuillez remplir la date et le titre");
    return;
  }

  events.push({
    id: Date.now(),
    date: Number(date),
    title,
    description: desc
  });

  render();
}

function render() {
  timeline.innerHTML = "";
  list.innerHTML = "";

  const line = document.createElement("div");
  line.className = "line";
  timeline.appendChild(line);

  events.sort((a,b) => a.date - b.date);

  events.forEach(e => {

    const x = e.date * zoom + 3000;

    const div = document.createElement("div");
    div.className = "event";
    div.style.left = x + "px";
    div.innerHTML = `<b>${e.date}</b><br>${e.title}`;

    div.onclick = () => selectEvent(e.id);

    timeline.appendChild(div);

    const item = document.createElement("div");
    item.innerText = `${e.date} - ${e.title}`;
    item.onclick = () => selectEvent(e.id);
    list.appendChild(item);
  });
}

function selectEvent(id) {
  selectedId = id;
  const e = events.find(x => x.id === id);

  document.getElementById("date").value = e.date;
  document.getElementById("eventTitle").value = e.title;
  document.getElementById("desc").value = e.description;
}

function saveEdit() {
  const e = events.find(x => x.id === selectedId);
  if (!e) return;

  e.date = Number(document.getElementById("date").value);
  e.title = document.getElementById("eventTitle").value;
  e.description = document.getElementById("desc").value;

  render();
}

/* zoom simple */
window.addEventListener("wheel", (e) => {
  zoom += e.deltaY * -0.001;
  zoom = Math.max(0.3, Math.min(zoom, 4));
  render();
});

render();
