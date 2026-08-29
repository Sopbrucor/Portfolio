document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulaireAccueil');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const data = Object.fromEntries(new FormData(form).entries());

            try {
                const response = await fetch('/api/recap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de l’enregistrement');
                }

                window.location.href = 'recap.html';
            } catch (error) {
                console.error(error);
                alert('Impossible d’enregistrer les données.');
            }
        });
    }

    const recapTableBody = document.getElementById('recapTableBody');

    if (recapTableBody) {
        fetch('/api/recap')
            .then(response => response.json())
            .then((data) => {
                const labels = ['Grade', 'Nom', 'Compagnie', 'Bâtiment', 'Message'];
                const values = [
                    data.grade || '—',
                    data.nom || '—',
                    data.compagnie || '—',
                    data.bâtiment || '—',
                    data.message || '—'
                ];

                recapTableBody.innerHTML = `
                    <tr>
                        ${labels.map(label => `<th>${label}</th>`).join('')}
                    </tr>
                    <tr>
                        ${values.map(value => `<td>${value}</td>`).join('')}
                    </tr>
                `;
            })
            .catch((error) => {
                console.error(error);
                recapTableBody.innerHTML = `
                    <tr>
                        <th>Erreur</th>
                        <td>Impossible de charger les données.</td>
                    </tr>
                `;
            });
    }
});


