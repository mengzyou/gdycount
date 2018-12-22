/**
 * serviceWorker register
 */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function () {
            console.log('Service Worker Registered');
        });
}
// 全局
let app = {
    cards: [],
    cardTemplate: document.querySelector('.cardTemplate'), // 对象的结构模板
    container: document.querySelector('.main') // 包含对象的父结构
};

// 给清除按钮添加click事件
document.getElementById('butClear').addEventListener('click', function () {
    app.clearCards();
});

// 给添加按钮田间click事件
document.getElementById('butAdd').addEventListener('click', function () {
    app.addCard();
});

// 清除所有
app.clearCards = function () {
    app.cards.forEach(item => {
        // 从页面中移除
        app.container.removeChild(item.dom);
        item = null;
    });
    // 数组清空
    app.cards = [];
    app.saveData();
};

// 添加一个
app.addCard = function () {
    // 初始化一个对象
    let card = {
        key: Math.random().toString(36).substr(2),
        name: '瞪眼' + app.cards.length,
        param: 4,
        total: 0
    };
    // 添加进数组
    app.cards.push(card);
    // 创造一个页面对象
    card.dom = app.addCardDom(card, app.cards.length - 1);
    app.saveData();
};

//添加一个页面对象
app.addCardDom = function (data, index) {
    // 复制一个结构
    let card = app.cardTemplate.cloneNode(true);
    // 去除class cardTemplate
    card.classList.remove('cardTemplate');
    // 添加到container里显示在界面上
    app.container.appendChild(card);

    // 对目前的dom对象赋值
    card.querySelector('.inputTotal').value = data.total;
    card.querySelector('.inputName').value = data.name;
    card.querySelector('.inputParam').value = data.param;

    // 当前对象的加号点击删除事件监听
    card.querySelector('.butAdd').addEventListener('click', function () {
        app.paramAddMinus(data, true);
    });

    // 当前对象的减号点击事件监听
    card.querySelector('.butMinus').addEventListener('click', function () {
        app.paramAddMinus(data, false);
    });

    // 当前对象的删除点击事件监听
    card.querySelector('.butDelete').addEventListener('click', function () {
        app.deleteCard(data, index);
    });
    // 当名字输入结束焦点离开输入框事件监听
    card.querySelector('.inputName').addEventListener('blur', function () {
        app.changeName(data, this.value);
    });
    // 当值输入结束焦点离开输入框事件监听
    card.querySelector('.inputParam').addEventListener('blur', function () {
        app.changeParam(data, +this.value);
    });
    return card;
};
// 加减值
app.paramAddMinus = function (data, add) {
    // 计算结果
    data.total += (add ? data.param : -data.param);
    // 显示在页面上
    data.dom.querySelector('.inputTotal').value = data.total;
    app.saveData();
};
// 删除其中一个
app.deleteCard = function (data, index) {
    // 从页面上删除结构
    app.container.removeChild(data.dom);
    // 从保存数组中删除
    app.cards.splice(index, 1);
    app.saveData();
    data = null; // 清空内存
};
// 修改了名字
app.changeName = function (data, value) {
    data.name = value;
    app.saveData();
};
// 修改了加减的值
app.changeParam = function (data, value) {
    data.param = value;
    app.saveData();
};
// 数据有改动，把数值存储到USERDATA
app.saveData = function () {
    console.log(app.cards);
    localStorage.setItem('USERDATA', JSON.stringify(app.cards));
};
// 从localStorage去值，添加cards
app.initData = function () {
    const data = localStorage.getItem('USERDATA');
    if (data) {
        app.cards = JSON.parse(data);
        app.cards.forEach((card, index) => {
            card.dom = app.addCardDom(card, index);
        });
    }
};
app.initData();
