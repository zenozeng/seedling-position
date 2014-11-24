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

// render pixels to canvas
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
    loadImage('small.jpg').then(function(canvas) {
        var ctx = canvas.getContext('2d'),
            width = canvas.width,
            height = canvas.height,
            pixels = ctx.getImageData(0, 0, width, height).data;

        var rows = 4;
        var cols = 8;

        var maxWidth = width / cols;
        var maxHeight = height / rows;

        pixels = tracking.Image.blur(pixels, width, height, 5);

        // 基于色相对进行二值化
        var r, g, b, a;
        for(var i = 0, len = pixels.length; i < len; i += 4) {
            r = pixels[i];
            g = pixels[i + 1];
            b = pixels[i + 2];

            var hsl = tinycolor({r: r, g: g, b: b}).toHsl();

            hsl.h = 0;

            if(hsl.s < 0.09) {
                pixels[i] = 0;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
            } else {
                pixels[i] = 255;
                pixels[i + 1] = 255;
                pixels[i + 2] = 255;
            }
        }

        // 逐行检查
        var offset_h = 0;
        for(var i = 0, len = pixels.length; i < len; i += width * 4) {
            var count = 0;
            for(var j = i; j < i + width * 4; j += 4) {
                if(pixels[j] === 0) {
                    count++;
                }
            }
            if(count / width > 0.8) {
                offset_h++;
                for(var j = i; j < i + width * 4; j += 4) {
                    pixels[j] = 0;
                    pixels[j + 1] = 0;
                    pixels[j + 2] = 255;
                }
            }
        }

        // 逐列检查
        var offset_w = 0;
        for(var i = 0; i < width; i++) {
            var count = 0;
            for(var j = i * 4; j < ((height - 1) * width + i) * 4; j += 4 * width) {
                if(pixels[j] === 0) {
                    count++;
                }
            }
            if(count / height > 0.8) {
                offset_w++;
                for(var j = i * 4; j < ((height - 1) * width + i) * 4; j += 4 * width) {
                    pixels[j] = 0;
                    pixels[j + 1] = 0;
                    pixels[j + 2] = 255;
                }
            }
        }

        // 计算平均大小
        var w = (width - offset_w) / cols;
        var h = (height - offset_h) / rows;

        console.log(w, h);

        render(canvas, pixels);
    });
});

