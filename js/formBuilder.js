var formBuilder = (function() {
    var formContainer = document.getElementById('formContainer');

    function addFormField(type, label) {
        var fieldHtml;
        var inputName = label.toLowerCase().replace(/\s+/g, '_');
        console.log(`Campo:${inputName}`)
        switch (type) {
            case 'text':
                fieldHtml = `
                    <div class="form-group">
                        <label for="${inputName}">${label}</label>
                        <input type="text" class="form-control" id="${inputName}" name="${inputName}" placeholder="${label}">
                    </div>
                `;
                break;
            case 'number':
                fieldHtml = `
                    <div class="form-group">
                        <label for="${inputName}">${label}</label>
                        <input type="number" class="form-control" id="${inputName}" name="${inputName}" placeholder="${label}">
                    </div>
                `;
                break;
            case 'date':
                fieldHtml = `
                    <div class="form-group">
                        <label for="${inputName}">${label}</label>
                        <input type="date" class="form-control" id="${inputName}" name="${inputName}" placeholder="${label}">
                    </div>
                `;
                break;
            case 'file':
                fieldHtml = `
                    <div class="form-group">
                        <label for="${inputName}">${label}</label>
                        <input type="file" class="form-control-file" name="photos[]" multiple accept="image/*">
                    </div>
                `;
                break;
        }
        $(formContainer).append(fieldHtml);
    }

    return {
        addFormField: addFormField
    };
})();
