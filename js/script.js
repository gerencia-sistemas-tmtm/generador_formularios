$(document).ready(function() {
    var elements = document.getElementById('elements');
    var formContainer = document.getElementById('formContainer');
    var configPreview = document.getElementById('configPreview');

    new Sortable(elements, {
        group: {
            name: 'elements',
            pull: 'clone',
            put: false
        },
        sort: false
    });

    new Sortable(formContainer, {
        group: {
            name: 'elements',
            put: true
        },
        onAdd: function (evt) {
            var itemEl = evt.item;
            var type = itemEl.getAttribute('data-type');
    
            // Extract the label text
            var labelText = 'Etiqueta'; // Default label text if not editable
            var editableLabel = document.querySelector('.editable-label');
            if (editableLabel) {
                labelText = editableLabel.innerText;
            }
    
            // Create the field with an initial editable label
            var fieldHtml = addFormField(type, labelText);
    
            // Append the generated field to the form container
            $(formContainer).append(fieldHtml);
    
            // Remove the dragged item from the elements list
            itemEl.parentNode.removeChild(itemEl);
    
            // Allow direct editing of the label in the form
            $('.editable-label').focus();

        }
    });
    
    function addFormField(type, label) {
        var fieldHtml;
        var inputName = label.toLowerCase().replace(/\s+/g, '_');
        console.log(`Campo:${inputName}`)
        switch (type) {
            case 'text':
                fieldHtml = `
                    <div class="form-group">
                        <label class="editable-label" contenteditable="true"">${label}</label>
                        <input type="text" class="form-control" id="${inputName}" name="${inputName}">
                    </div>
                `;
                break;
            case 'number':
                fieldHtml = `
                    <div class="form-group">
                        <label class="editable-label" contenteditable="true"">${label}</label>
                        <input type="number" class="form-control" id="${inputName}" name="${inputName}">
                    </div>
                `;
                break;
            case 'date':
                fieldHtml = `
                    <div class="form-group">
                        <label class="editable-label" contenteditable="true"">${label}</label>
                        <input type="date" class="form-control" id="${inputName}" name="${inputName}">
                    </div>
                `;
                break;
            case 'file':
                fieldHtml = `
                    <div class="form-group">
                        <label class="editable-label" contenteditable="true"">${label}</label>
                        <input type="file" class="form-control-file" name="photos[]" multiple accept="image/*">
                    </div>
                `;
                break;
        }
        $(formContainer).append(fieldHtml);
    }

    $('#generateForm').on('click', function(e) {
        e.preventDefault();

        var formTitle = $('input[name="formTitle"]').val();
        var emailInput = $('input[name="emailInput"]').val();
        var formHtml = generateFormHtml();

        $.ajax({
            type: 'POST',
            url: 'process.php',
            data: {
                formHtml: formHtml,
                formTitle: formTitle,
                emailInput: emailInput
            },
            success: function(response) {
                $('#message').html('<div class="alert alert-success">' + response + '</div>');
            },
            error: function(xhr, status, error) {
                $('#message').html('<div class="alert alert-danger">Error al generar el formulario.</div>');
                console.error(xhr.responseText);
            }
        });

    }); 

    // Escuchar cambios en las etiquetas editables y actualizar el label del campo
    $(formContainer).on('input', '.editable-label', function() {
        let labelText = $(this).text().trim();
        $(this).prev('input, select, textarea').prev('label').text(labelText);
        $(this).next().attr('name', labelText);
    });

   // Función para generar el HTML del formulario completo
   function generateFormHtml() {
    var formTitle = $('input[name="formTitle"]').val();
    var emailInput = $('input[name="emailInput"]').val();
    var formHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${formTitle}</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                /* Aquí puedes agregar estilos adicionales si es necesario */
            </style>
        </head>
        <body>
            <div class="container mt-5">
                <h2 class="text-center">${formTitle}</h2>
                <form id="submitForm" class="mt-3">
                    ${$(formContainer).html()}
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
                        var formData = $('#submitForm').serializeArray();
                        formData.push({ name: 'formTitle', value: '${formTitle}' });
                        formData.push({ name: 'emailInput', value: '${emailInput}' });

                        $.ajax({
                            url: '../../send_email.php',
                            type: 'POST',
                            data: formData,
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
});
