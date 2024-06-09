document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                processCSV(text, 10); // Process only the top 10 rows
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    });

    function processCSV(csv, rowsToShow) {
        const lines = csv.split('\n');
        const labels = [];
        const prices = [];

        // Loop through the specified number of rows or until the end of the file
        for (let i = 0; i < Math.min(rowsToShow, lines.length); i++) {
            const line = lines[i];
            const [date, price] = line.split(',');
            if (date && price) {
                labels.push(date);
                prices.push(parseFloat(price));
            }
        }

        displayStockData(labels, prices);
        renderChart(labels, prices);
    }

    function displayStockData(labels, prices) {
        const stockDataDiv = document.getElementById('stock-data');
        let html = '<ul>';
        labels.forEach((label, index) => {
            html += `<li>${label}: ${prices[index]}</li>`;
        });
        html += '</ul>';
        stockDataDiv.innerHTML = html;
    }

    function renderChart(labels, prices) {
        const ctx = document.getElementById('stockChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Stock Price',
                    data: prices,
                    borderColor: 'black',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    // Fetch financial news
    fetch('https://newsapi.org/v2/everything?q=finance&apiKey=429efabf6d5c4c019797a5d3378c3568')
        .then(response => response.json())
        .then(data => {
            const articles = data.articles.slice(0, 3); // Display top 3 news articles
            let newsHTML = '';
            articles.forEach(article => {
                newsHTML += `
                    <div class="news-article">
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                    </div>
                `;
            });
            document.getElementById('news-feed').innerHTML = newsHTML;
        })
        .catch(error => console.error('Error fetching news:', error));
});

