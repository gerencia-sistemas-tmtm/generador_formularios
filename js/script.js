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

            // Crear el campo con una etiqueta inicial editable
            var fieldHtml = `
                <div class="form-group">
                    <label class="editable-label" contenteditable="true">Etiqueta</label>
                    ${getFieldHtml(type)}
                </div>
            `;

            // Agregar el campo generado al contenedor de formulario
            $(formContainer).append(fieldHtml);

            // Eliminar el elemento arrastrado de la lista de elementos
            itemEl.parentNode.removeChild(itemEl);

            // Permitir editar la etiqueta directamente en el formulario
            $('.editable-label').focus();
        }
    });

    function getFieldHtml(type) {
        var fieldHtml;
        switch (type) {
            case 'text':
                fieldHtml = '<input type="text" class="form-control" name="textInput" required>';
                break;
            case 'number':
                fieldHtml = '<input type="number" class="form-control" name="numberInput" required>';
                break;
            case 'date':
                fieldHtml = '<input type="date" class="form-control" name="dateInput" required>';
                break;
            case 'file':
                fieldHtml = '<input type="file" class="form-control-file" name="photos[]" multiple accept="image/*">';
                break;
        }
        return fieldHtml;
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
        var labelText = $(this).text().trim();
        $(this).prev('input, select, textarea').prev('label').text(labelText);
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
                        <button id="sendReportBtn" type="submit" class="btn btn-primary">Enviar reporte</button>
                    </div>
                </form>
            </div>
            <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
            <script>
                // Evento al enviar el formulario
                $('#submitForm').on('submit', function(e) {
                    e.preventDefault();

                    // Obtener el HTML del formulario
                    var formHtml = $('#submitForm').html();

                    // Enviar el formulario por AJAX a send_email.php
                    $.ajax({
                        type: 'POST',
                        url: '../../send_email.php',
                        data: {
                            formHtml: formHtml,
                            formTitle: '${formTitle}',
                            emailInput: '${emailInput}'
                        },
                        success: function(response) {
                            $('#message').html('<div class="alert alert-success">' + response + '</div>');
                        },
                        error: function(xhr, status, error) {
                            $('#message').html('<div class="alert alert-danger">Error al enviar el reporte.</div>');
                            console.error(xhr.responseText);
                        }
                    });
                });
            </script>
        </body>
        </html>
    `;
    return formHtml;
    }
});
