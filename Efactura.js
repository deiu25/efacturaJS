document.getElementById('invoiceForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const accessToken = '37cc6b97e3c721de7b67eb599e6db2134879e0df89e77074d041164c11563dc3';
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

                // Extragere index de încărcare din răspunsul XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                const uploadIndex = xmlDoc.getElementsByTagName("header")[0].getAttribute("index_incarcare");

                // Actualizare DOM pentru a afișa indexul de încărcare
                document.getElementById('uploadIndex').textContent = `Index de încărcare: ${uploadIndex}`;
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
