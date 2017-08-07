# bumpMapping
基于webgl和vue2实现bump mapping效果和shadow mapping效果

bump mapping是一种对gpu廉价(高效)的实现凹凸纹理的算法。这个算法不需要为了凹凸效果去改变顶点坐标，所有的凹凸纹理完全在着色器内部生成

shadow mapping是一种生成舞台中元素影子的算法。

## Bump Mapping效果图

### 调整前的原始纹理

![image](https://github.com/rainsilence0911/bumpMapping/blob/master/snipshot/Capture.PNG)

### 调整后的凹凸纹理

![image](https://github.com/rainsilence0911/bumpMapping/blob/master/snipshot/Capture2.PNG)

### Shadow Mapping效果图

![image](https://github.com/rainsilence0911/bumpMapping/blob/master/snipshot/Capture3.PNG)


## How to install

1. npm install

2. npm start

3. 调整bump height，感受数学的力量
