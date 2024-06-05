document.getElementById('mergeBtn').addEventListener('click', mergeCSVFiles);
function mergeCSVFiles() {
    const files = document.getElementById('csvFiles').files;
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('d-none');
    
    if (files.length === 0) {
        alert('Please upload CSV file.');
        return;
    }

    let mergedData = [];
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
        Papa.parse(file, {
            complete: function(results) {
                if (results.errors.length > 0) {
                    errorMessage.textContent = `Error processing file ${file.name}: ${results.errors[0].message}`;
                    errorMessage.classList.remove('d-none');
                    return;
                }
                const data = results.data;
                if (mergedData.length === 0) {
                    mergedData = data;
                } else {
                    data.slice(1).forEach(row => mergedData.push(row));
                }
                filesProcessed++;
                if (filesProcessed === files.length) {
                    downloadMergedCSV(mergedData);
                }
            },
            error: function(error) {
                errorMessage.textContent = `Error processing file ${file.name}: ${error.message}`;
                errorMessage.classList.remove('d-none');
            }
        });
    });
}

function downloadMergedCSV(data) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'merged.csv';
    downloadLink.classList.remove('d-none');
}