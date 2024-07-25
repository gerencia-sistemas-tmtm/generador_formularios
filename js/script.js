$(document).ready(function() {
    var elements = document.getElementById('elements');
    var formContainer = document.getElementById('formContainer');

    initializeSortable();
    initializeFormGeneration();
    fetchAndSetCurrentForms();

    // Event listener for form buttons
    $(document).on('click', '.form-btn', function(e) {
        let id = $(this).attr('id');
        getForm(id);
    });

    $(document).on('click', '.btn-delete', function(e) {
        e.preventDefault()

        $(e.currentTarget).closest('.container').remove()
    });

    // Event listener for editable labels
    $(formContainer).on('input', '.editable-label', function() {
        let labelText = $(this).text().trim();
        $(this).next().attr('name', labelText);
    });
});

function initializeSortable() {
    new Sortable(document.getElementById('elements'), {
        group: {
            name: 'elements',
            pull: 'clone',
            put: false
        },
        sort: false
    });

    new Sortable(document.getElementById('formContainer'), {
        group: {
            name: 'elements',
            put: true
        },
        onAdd: function(evt) {
            var itemEl = evt.item;
            var type = itemEl.getAttribute('data-type');
            var labelText = 'Etiqueta';
            var editableLabel = document.querySelector('.editable-label');
            if (editableLabel) {
                labelText = editableLabel.innerText;
            }
            var fieldHtml = addFormField(type, labelText);
            $(formContainer).append(fieldHtml);
            itemEl.parentNode.removeChild(itemEl);
            $('.editable-label').focus();
        }
    });
}

function initializeFormGeneration() {
    $('#generateForm').on('click', function(e) {
        e.preventDefault();
        var formTitle = $('input[name="formTitle"]').val();
        var emailInput = $('input[name="emailInput"]').val();
        var formHtml = generateFormHtml(formTitle, emailInput);
        fetch('process.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                formHtml: formHtml,
                formTitle: formTitle,
                emailInput: emailInput
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('message').innerHTML = '<div class="alert alert-success">' + data + '</div>';
        })
        .catch(error => {
            document.getElementById('message').innerHTML = '<div class="alert alert-danger">Error al generar el formulario.</div>';
            console.error('There was a problem with the fetch operation:', error);
        });
        
    });
}

function addFormField(type, label) {
    var inputName = label.toLowerCase().replace(/\s+/g, '_');
    var fieldHtml;
    switch (type) {
        case 'text':
            fieldHtml = `
                <div class="row container">
                    <div class="col-md-10 generated">
                        <div class="form-group">
                            <label class="editable-label" contenteditable="true">${label}</label>
                            <input type="text" class="form-control" id="${inputName}" name="${inputName}">
                        </div>
                    </div>
                    <div class="col-md-2 form-delete"><button class="btn btn-danger btn-delete"><i class="bi bi-trash3"></i></div>
                </div>
            `;
            break;
        case 'number':
            fieldHtml = `
                <div class="row container">
                    <div class="col-md-10 generated">
                        <div class="form-group">
                            <label class="editable-label" contenteditable="true">${label}</label>
                            <input type="number" class="form-control" id="${inputName}" name="${inputName}">
                        </div>
                    </div>
                    <div class="col-md-2 form-delete"><button class="btn btn-danger btn-delete"><i class="bi bi-trash3"></i></div>
                </div>
            `;
            break;
        case 'date':
            fieldHtml = `
                <div class="row container">
                    <div class="col-md-10 generated">
                        <div class="form-group">
                            <label class="editable-label" contenteditable="true">${label}</label>
                            <input type="date" class="form-control" id="${inputName}" name="${inputName}">
                        </div>
                    </div>
                    <div class="col-md-2 form-delete"><button class="btn btn-danger btn-delete"><i class="bi bi-trash3"></i></div>
                </div>
            `;
            break;
        case 'file':
            fieldHtml = `
                <div class="row container">
                    <div class="col-md-10 generated">
                        <div class="form-group">
                            <label class="editable-label" contenteditable="true">${label}</label>
                            <input type="file" class="form-control-file" id="fileInput" name="fileInput[]" multiple>
                        </div>
                    </div>
                    <div class="col-md-2 form-delete"><button class="btn btn-danger btn-delete"><i class="bi bi-trash3"></i></div>
                </div>
            `;
            break;
    }
    return fieldHtml;
}

function modifyFormForUser(html) {
    // Create a temporary container to hold the HTML content
    var tempContainer = $('<div></div>').html(html);
    
    // Remove all div elements with the class form-delete
    tempContainer.find('div.form-delete').remove();
    tempContainer.find('div.generated').removeClass('col-md-10');
    tempContainer.find('div.generated').addClass('col-md-12');
    
    // Return the modified HTML
    return tempContainer.html();
}

function generateFormHtml(formTitle, emailInput) {

    var originalHtml = $(formContainer).html();
    var modifiedHtml = modifyFormForUser(originalHtml);

    var formHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${formTitle}</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h2 class="text-center">${formTitle}</h2>
                <form id="submitForm" class="mt-3">
                    ${modifiedHtml}
                    <div class="form-group">
                        <button type="button" class="btn btn-primary" id="sendReportButton">Enviar reporte</button>
                    </div>
                </form>
            </div>
            <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            <script>
                $(document).ready(function() {
                    $('#sendReportButton').on('click', function() {
                        var formData = new FormData($('#submitForm')[0]);
                        formData.append('formTitle', '${formTitle}');
                        formData.append('emailInput', '${emailInput}');
                        $.ajax({
                            url: '../../send_email.php',
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                alert(response);
                            },
                            error: function(xhr, status, error) {
                                alert('Error al enviar el reporte.');
                            }
                        });
                    });
                });
            </script>
        </body>
        </html>
    `;
    return formHtml;
}

function setCurrentForms(directories) {
    let currentForms = document.getElementById('current-forms');
    if (directories.length != 0) {
        directories.forEach(dir => {
            currentForms.insertAdjacentHTML('afterbegin', `<button class="dropdown-item form-btn" type="button" id="${dir}">${dir}</button>`);
        });
    }
    else {
        currentForms.insertAdjacentHTML('afterbegin', `<button class="dropdown-item form-btn" type="button" >No hay formularios</button>`);
    }
}

async function fetchAndSetCurrentForms() {
    const url = "/Reporter_php/directories.php?path=forms";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setCurrentForms(json);
    } catch (error) {
        console.error(error.message);
    }
}

async function getForm(form) {
    const url = `/Reporter_PHP/read_html.php?path=forms/${form}/`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        loadForm(json)
    } catch (error) {
        console.error(error.message);
    }
}

function loadForm(code) {
    //let lines = code.reverse();
    let lines = code
    lines.forEach(line => {
        if (line.trim() != "") {
            if (!line.includes('button')) {
                line = $.parseHTML(line);
                //console.log(line)
                $(line).children().removeClass('col-md-12');
                $(line).children().addClass('col-md-10');
                $(line).append('<div class="col-md-2 form-delete"><button class="btn btn-danger btn-delete"><i class="bi bi-trash3"></i></div>');
                $('#formContainer').append(line);
                //document.getElementById('formContainer').insertAdjacentHTML('afterbegin', line);
            }
        }
    })
}