var loadImage = function(src) {
    var deferred = Q.defer();

    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = src;
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        ctx.drawImage(img, 0, 0);
        deferred.resolve(canvas);
    };

    return deferred.promise;
};

var render = function(canvas, pixels) {
    var ctx = canvas.getContext('2d'),
        width = canvas.width,
        height = canvas.height;

    var imgData = ctx.createImageData(width, height);
    console.log(imgData);
    console.log(pixels);
    for(var i = 0, data = imgData.data, len = pixels.length; i < len; i++) {
        data[i] = pixels[i];
    }
    ctx.putImageData(imgData, 0, 0);
};

// init app
$(function() {
    loadImage('sample.jpg').then(function(canvas) {
        var ctx = canvas.getContext('2d'),
            width = canvas.width,
            height = canvas.height;

        var pixels = ctx.getImageData(0, 0, width, height).data;
        console.log(pixels);

        render(canvas, tracking.Image.grayscale(pixels, width, height, true));
    });
});

