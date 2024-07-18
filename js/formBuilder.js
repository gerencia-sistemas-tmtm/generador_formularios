var formBuilder = (function() {
    var formContainer = document.getElementById('formContainer');

    function addFormField(type, label) {
        var fieldHtml;
        switch (type) {
            case 'text':
                fieldHtml = `
                    <div class="form-group">
                        <label>${label}</label>
                        <input type="text" class="form-control" name="textInput" required>
                    </div>
                `;
                break;
            case 'number':
                fieldHtml = `
                    <div class="form-group">
                        <label>${label}</label>
                        <input type="number" class="form-control" name="numberInput" required>
                    </div>
                `;
                break;
            case 'date':
                fieldHtml = `
                    <div class="form-group">
                        <label>${label}</label>
                        <input type="date" class="form-control" name="dateInput" required>
                    </div>
                `;
                break;
            case 'file':
                fieldHtml = `
                    <div class="form-group">
                        <label>${label}</label>
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
