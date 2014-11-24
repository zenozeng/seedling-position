# seedling-position

Get seedling position based on machine vision.

## 原理

该问题可以被简化成寻找背景并将图片进行二值化。
可以利用色相与饱和度特征进行寻找。
通过利用整体信息来减少局部干扰带来的影响。

## TODO

- 角度矫正

- 计算基准线 X / Y

- 计算单个矩形的参数（半径，圆角半径）

- 标记每个圆角矩形

- 判断是否存在植物

## Ref

- [图像特征提取：Sobel边缘检测](http://www.cnblogs.com/ronny/p/3387575.html)

- [A fast RGB to HSV floating point conversion](http://lolengine.net/blog/2013/01/13/fast-rgb-to-hsv)
