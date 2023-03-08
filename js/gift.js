class Transform { //定义类 变换
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

    }
}
class Particle {//定义类 粒子
    constructor(Transform, offset, direction_x, direction_y, color) {
        this.transform = Transform;
        this.offset = offset;
        this.direction_x = direction_x;
        this.direction_y = direction_y;
        this.color = color;
    }
    draw() {//函数 画出粒子
        ctx.save();
        ctx.scale(1, -1);//设置画笔scale
        //设置阴影模拟辉光
        ctx.shadowColor = this.color;//设置阴影颜色
        ctx.shadowBlur = 20;//设置阴影模糊程度
        ctx.fillStyle = this.color;//设置颜色
        x = this.transform.width / 2.0 + this.transform.x;//计算粒子坐标
        y = this.transform.height / 2.0 + this.transform.y;
        ctx.fillRect(x + this.direction_x * this.offset, y + this.direction_y * this.offset, this.transform.width, this.transform.height);//画出粒子
        ctx.restore();
    }
}
var LoveParticles = new Array();//主粒子
var particle = new Array();//爆炸粒子
var pageWidth = document.documentElement.scrollWidth;//获得页面长宽
var pageHeight = document.documentElement.scrollHeight;
var cvs = document.getElementById("cvs");//获得画布
var frame = 0;//初始化帧
cvs.width = pageWidth;//设置画布大小
cvs.height = pageHeight * 69 / 100;
var ctx = cvs.getContext('2d');//设置画笔
var speed = 10;//设置爆炸速度
var back=false,explode=false,reset=false;
var request;
var interval;
function easeOutQuad(currentTime, startValue, changeValue, duration) {//缓出
    currentTime /= duration;
    return -changeValue * currentTime * (currentTime - 2) + startValue;
}
function easeInQuad(currentTime, startValue, changeValue, duration) {//缓入
    currentTime /= duration;
    return changeValue * currentTime * currentTime + startValue;
}
function draw() {//更新 函数
    frame++;
    //拖尾效果
    ctx.fillStyle = 'rgba(184, 142, 94,0.3)';
    ctx.fillRect(0,0,cvs.width,cvs.height);
    //主粒子
    LoveParticles.forEach((element) => {
        //更新主粒子偏移
        if(back)
        {
            element.offset = easeInQuad(frame, 0, 1000, 120)
            if(element.offset>50)explode=true;
            if(element.offset>1000&&!reset)
            {
                setTimeout(()=>{
                    init();
                    cancelAnimationFrame(request);
                },1000)
                clearInterval(interval);
                interval = setInterval(function(){
                    ctx.globalAlpha -= 0.1
                    
                },100)
                reset=true;
            }
        }
        if (element.offset > 0&&back==false) {
            element.offset = easeOutQuad(frame, 1000, -1000, 120);//缓出
            if(element.offset<=0){back=true;frame=0;}//part1动画结束，设置变量
        }
        
        element.draw();//画出粒子
    })
    if(back&&explode)
    {
        //更新爆炸粒子偏移
        particle.forEach((val) => {
            val.draw();
            val.offset += speed;
        })
        speed+=1;
    }
    window.requestAnimationFrame(draw);
}
function init() {//初始化函数
    //初始化变量
    clearInterval(interval);
    ctx.globalAlpha=0;
    back=false,explode=false;frame=0;reset=false;
    speed=10;
    LoveParticles.splice(0,LoveParticles.length); 
    particle.splice(0,particle.length); 
    //设置主粒子位置
    for (let i = 0; i < 30; i += 0.2) {
        angle = i / Math.PI;
        x = 10 * (16 * Math.sin(angle) ** 3);
        y = 10 * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
        LoveParticles.push(new Particle(new Transform(cvs.width / 2 + x, y - cvs.height / 2, 7, 7), 1000, Math.random() * 2 - 1, Math.random() * 2 - 1, "#FF0000"));
    }
    for (let i = 0; i < 30; i += 0.2) {
        angle = i / Math.PI;
        x = 10 * (16 * Math.sin(angle) ** 3);
        y = 10 * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
        LoveParticles.push(new Particle(new Transform(cvs.width / 2 + x + Math.random() * 50 - 25, y - cvs.height / 2 + Math.random() * 50 - 25, 7, 7), 1000, Math.random() * 2 - 1, Math.random() * 2 - 1, "rgba(255,70,70,0.7)"));
    }
    for (let i = 0; i < 30; i += 0.2) {
        angle = i / Math.PI;
        x = 10 * (16 * Math.sin(angle) ** 3);
        y = 10 * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
        LoveParticles.push(new Particle(new Transform(cvs.width / 2 + x + Math.random() * 100 - 50, y - cvs.height / 2 + Math.random() * 100 - 50, 7, 7), 1000, Math.random() * 2 - 1, Math.random() * 2 - 1, "rgba(255,70,70,0.5)"));
    }
    //设置爆炸粒子位置
    for (let i = 0; i < 100; i++) {
        particle.push(new Particle(new Transform(cvs.width / 2, -cvs.height / 2, 5, 5), 0, Math.random() * 2 - 1, Math.random() * 2 - 1, "orange"))
    }
    //更改透明度
    interval = setInterval(function(){
        ctx.globalAlpha += 0.1
        if(ctx.globalAlpha>=1)
        {
            globalAlpha=1;
            clearInterval(interval);
        }
    },80)
    request = window.requestAnimationFrame(draw);
}