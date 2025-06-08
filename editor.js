document.getElementById('editor-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = {
    text1: this.text1.value,
    text2: this.text2.value,
    text3: this.text3.value,
  };

  fetch('http://localhost:3000/editorinhalte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then((r) => r.json())
    .then((d) => {
      alert('Gespeichert mit ID: ' + d.id);
    })
    .catch(() => alert('Fehler beim Speichern'));
});
