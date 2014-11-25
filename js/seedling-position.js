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
    loadImage('sample.jpg').then(function(canvas) {
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

        var horizontalLines = [],
            verticalLines = [];

        // 逐行检查
        for(var i = 0; i < height; i++) {
            var count = 0;
            for(var j = i * width * 4; j < (i + 1) * width * 4; j += 4) {
                if(pixels[j] === 0) {
                    count++;
                }
            }
            if(count / width > 0.75) {
                horizontalLines.push(i);
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
            if(count / height > 0.7) {
                verticalLines.push(i);
            }
        }

        // 高亮参考线
        // 仅仅保留连续数组的分割位置
        console.log(horizontalLines);
        var getEdges = function(intList) {
            return intList.filter(function(elem, i, arr) {
                if(i === 0 || i === arr.length) return false;
                if(arr[i + 1] !== elem + 1) return true;
                if(arr[i - 1] === elem - 1) return false;
                return true;
            });
        };

        getEdges(horizontalLines).forEach(function(h) {
            console.log(h);
            ctx.beginPath();
            ctx.moveTo(0, h);
            ctx.lineTo(width - 1, h);
            ctx.strokeStyle="#fff";
            ctx.stroke();
        });

        getEdges(verticalLines).forEach(function(w) {
            ctx.beginPath();
            ctx.moveTo(w, 0);
            ctx.lineTo(w, height - 1);
            ctx.strokeStyle="#fff";
            ctx.stroke();
        });
    });
});

