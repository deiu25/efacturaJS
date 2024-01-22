document.getElementById('invoiceForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const accessToken = '';
    const invoiceFile = document.getElementById('invoiceFile').files[0];

    if (invoiceFile && invoiceFile.type === 'text/xml') {
        try {
            const reader = new FileReader();
            reader.onload = async function(event) {
                const xmlData = event.target.result;
                const response = await fetch('http://localhost:5000/api/test/FCTEL/rest/upload?standard=UBL&cif=13196988', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'text/xml' 
                    },
                    body: xmlData
                });

                if (!response.ok) {
                    throw new Error(`Eroare HTTP: ${response.status}`);
                }

                const xmlText = await response.text();
                console.log('Răspuns XML primit:', xmlText);
            };
            reader.onerror = function(error) {
                console.error('Eroare la citirea fișierului XML:', error);
            };
            reader.readAsText(invoiceFile);
        } catch (error) {
            console.error('Eroare la încărcarea facturii:', error.message);
        }
    } else {
        console.error('Vă rugăm să selectați un fișier XML valid.');
    }
});
