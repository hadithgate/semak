let nameData = [];

async function fetchNamesFromCSV() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSi9uwRF1WGcHvUsHEALXQKgjjHg8UMQfC4LDLIXoQehEeaCBbQnUOzfVpielwTGOiy8HZRGOUvxyPH/pub?gid=0&single=true&output=csv";
    
    try {
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        
        // Split CSV into rows and skip the header (assuming first row is a header)
        const rows = csvText.split('\n').slice(1);
        
        rows.forEach((row, index) => {
            const cols = row.split(',');

            if (cols[1] && cols[2]) {
                nameData.push({
                    name: cols[1].trim(),
                    category: cols[2].trim(),
                    additionalInfo: {
                        namaPenuh: cols[3] || '',
                        tabaqah: cols[6] || '',
                        yahya_opinion: cols[7] || '',
                        yahya_source: cols[8] || '',
                        hanbal_opinion: cols[10] || '',
                        hanbal_source: cols[11] || '',
                        bukhari_opinion: cols[13] || '',
                        bukhari_source: cols[14] || '',
                        abuZurah_opinion: cols[16] || '',
                        abuZurah_source: cols[17] || '',
                        abuHatim_opinion: cols[19] || '',
                        abuHatim_source: cols[20] || '',
                        nasai_opinion: cols[22] || '',
                        nasai_source: cols[23] || '',
                        uqayli_opinion: cols[25] || '',
                        uqayli_source: cols[26] || '',
                        ibnHibban_opinion: cols[28] || '',
                        ibnHibban_source: cols[29] || '',
                        ibnAdi_opinion: cols[31] || '',
                        ibnAdi_source: cols[32] || '',
                        daruqutni_opinion: cols[34] || '',
                        daruqutni_source: cols[35] || '',
                        ibnHajar_opinion: cols[37] || '',
                        ibnHajar_source: cols[38] || '',
                        tahrir_opinion: cols[40] || '',
                        tahrir_source: cols[41] || ''
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

async function generateResult() {
    await fetchNamesFromCSV();
    
    const paragraphBox = document.getElementById('paragraphBox');
    const textContent = paragraphBox.innerText;

    let result = 'Sahih';  // Default result
    let resultColor = '#8BC34A';  // Default color for Sahih
    let highlightedText = textContent;  // Text that will be displayed with highlights

    // Iterate over nameData to find matching names in the paragraphBox text content
    nameData.forEach(entry => {
        const name = entry['name'];
        const category = entry['category'];
        const additionalInfo = JSON.stringify(entry['additionalInfo']);  // Stringify the additional info

        if (textContent.includes(name)) {
            let highlightColor = '';

            // Assign colors and result status based on the category
            if (category === 'ثقة') {
                highlightColor = '#8BC34A';  // Green for Sahih
            } else if (category === 'صدوق') {
                highlightColor = '#64B5F6';  // Blue for Hasan
                if (result !== 'موضوع' && result !== 'ضعيف') {
                    result = 'Hasan';
                    resultColor = '#64B5F6';
                }
            } else if (category === 'ضعيف محتمل') {
                highlightColor = '#FFEB3B';  // Yellow for Dhaif Muhtamal
                if (result !== 'موضوع') {
                    result = 'Dhaif Muhtamal';
                    resultColor = '#FFEB3B';
                }
            } else if (category === 'ضعيف') {
                highlightColor = '#FF9800';  // Orange for Dhaif
                if (result !== 'موضوع') {
                    result = 'Dhaif';
                    resultColor = '#FF9800';
                }
            } else if (category === 'شديد الضعف') {
                highlightColor = '#D2691E';  // Chocolate for Syadid al-Dhaf
                if (result !== 'موضوع') {
                    result = 'Syadid al-Dhaf';
                    resultColor = '#D2691E';
                }
            } else if (category === 'واه' || category === 'واهي') {
                highlightColor = '#E57373';  // Red for Wahi or Palsu
                result = 'Palsu';
                resultColor = '#E57373';
            }

            // Replace name occurrences with highlighted spans and embed additional info in data attributes
            highlightedText = highlightedText.replace(new RegExp(name, 'g'), 
                `<span class="highlight" style="background-color:${highlightColor}" 
                data-info='${additionalInfo}' data-category="${category}">${name}</span>`);
        }
    });

    // Update the paragraphBox content with the highlighted text
    paragraphBox.innerHTML = highlightedText;

    // Update the resultBox with the result and color
    const resultBox = document.getElementById('resultBox');
    resultBox.style.backgroundColor = resultColor;
    resultBox.textContent = `Keputusan: ${result}`;

    // Add event listeners for highlighted spans (optional, if needed)
    document.querySelectorAll('.highlight').forEach(span => {
        span.addEventListener('click', function() {
            const info = JSON.parse(this.getAttribute('data-info'));
            console.log('Additional Info:', info);  // Show additional info when a name is clicked
        });
    });
}
