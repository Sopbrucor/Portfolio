document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulaireAccueil');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());
            localStorage.setItem('sitiFormData', JSON.stringify(data));
            window.location.href = 'recap.html';
        });
    }

    const recapTableBody = document.getElementById('recapTableBody');

    if (recapTableBody) {
        const savedData = JSON.parse(localStorage.getItem('sitiFormData') || '{}');
        const labels = ['Grade', 'Nom', 'Compagnie', 'Bâtiment', 'Message'];
        const values = [
            savedData.grade || '—',
            savedData.nom || '—',
            savedData.compagnie || '—',
            savedData.bâtiment || '—',
            savedData.message || '—'
        ];

        recapTableBody.innerHTML = `
            <tr>
                ${labels.map(label => `<th>${label}</th>`).join('')}
            </tr>
            <tr>
                ${values.map(value => `<td>${value}</td>`).join('')}
            </tr>
        `;
    }
});


