function compressImage(file, maxSizeMb, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const width = img.width;
            const height = img.height;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(function(blob) {
                if (blob.size / 1024 / 1024 > maxSizeMb) {
                    const scale = Math.sqrt(maxSizeMb / (blob.size / 1024 / 1024));
                    const newWidth = width * scale;
                    const newHeight = height * scale;
                    canvas.width = newWidth;
                    canvas.height = newHeight;
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                    canvas.toBlob(callback, file.type);
                } else {
                    callback(blob);
                }
            }, file.type);
        };
    };
}
