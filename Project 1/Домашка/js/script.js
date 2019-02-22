/*jshint esversion:6*/
window.addEventListener('DOMContentLoaded', () => {
    // Работа с оптимизацией базы данных
    // Обращение к серверу
    const loadContent = async(url, callback) => {
        await fetch(url) //Обещание
            .then(response => response.json()) //обещание которое json превратит в обычный объект
            .then(json => createElement(json.goods));

        callback();
    }

    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods__wrapper');

        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
            <img class="goods__img" src="${item.url}" alt="phone">
            <div class="goods__colors">Доступно цветов: 4</div>
            <div class="goods__title">
                ${item.title}
            </div>
            <div class="goods__price">
                <span>${item.price}</span> руб/шт
            </div>
            <button class="goods__btn">Добавить в корзину</button>
        `;
            goodsWrapper.appendChild(card);
        });
    }

    loadContent('js/db.json', () => {
        const cartWrapper = document.querySelector(".cart__wrapper"),
            /*Корзина*/
            cart = document.querySelector(".cart"),
            /*Корзина*/
            close = document.querySelector(".cart__close"),
            /*Крестик закрыть*/
            open = document.querySelector("#cart"),
            /*Открыть*/
            goodsBtn = document.querySelectorAll(".goods__btn"),
            /*Все кнопки*/
            products = document.querySelectorAll(".goods__item"),
            /*Карточки*/
            confirm = document.querySelector(".confirm"),
            badge = document.querySelector(".nav__badge"),
            /*Информация корзины*/
            totalCost = document.querySelector(".cart__total > span"),
            /*стоимость*/
            titles = document.querySelectorAll(".goods__title");


        open.addEventListener("click", openCart); /* Открыват  корзину*/
        close.addEventListener("click", closeCart); /*Закрывает корзину*/

        function openCart() {
            /* Открыват  корзину*/
            cart.style.display = "block";
            document.body.style.overflow = "hidden"; /*!отменят прокрутку страници*/
        }

        function closeCart() {
            /*Закрывает корзину*/
            cart.style.display = "none";
            document.body.style.overflow = "";
        }

        /* цикл обращатся ко все кнопкам и пр нажатии на любой происходит событие*/
        goodsBtn.forEach(function(btn, i) {
            btn.addEventListener("click", () => {
                let item = products[i].cloneNode(true),
                    /*Кланируем карточку товара*/
                    trigger = item.querySelector("button"),
                    /* Обращаемся к элемнту button*/
                    removeBtn = document.createElement("div"),
                    /* создать блок*/
                    empty = cartWrapper.querySelector(".empty"); /* В блоке cartWrapper обращаемся классу empty*/

                trigger.remove(); /*удаляем кнопку (добавить в корзину)*/
                showConfirm(); /* Аниманиця добавление товара в корзину*/
                calсGoods(1); /*Подсчет товара в корзине*/

                removeBtn.classList.add("goods__item-remove"); /*Добавляем  к div класс */
                removeBtn.innerHTML = "&times"; /*создаем символ X*/
                item.appendChild(removeBtn); /*Добовляем дочерний элемент*/

                cartWrapper.appendChild(item); /*Добовляем дочерний элемент*/

                /*проверяем есть что нибудь empty (лож или правда)*/
                if (empty) {
                    /*Удаляем текст корзина пуста*/

                    empty.style.display = "none";
                }

                //Вызываю фкнкцию подсчета общей суммы товара
                calcTotal();
                removeFromcart();


            });

        });

        sliceTitle();

        function sliceTitle() {
            //Проверка символа (описание продуката)
            titles.forEach(function(item) {
                if (item.textContent.length < 60) {
                    return;
                } else {
                    //Обрезаем текст
                    const str = item.textContent.slice(0, 61) + '...';
                    //Вставка отредактированного текста
                    item.textContent = str;
                }
            });

            /* Аниманиця добавление товара в карзину*/
        };

        function showConfirm() {
            confirm.style.display = "block"; //Показ блока 
            let counter = 100; //счетчик 
            const id = setInterval(frame, 10); //цикл(счетчик)
            function frame() {
                if (counter == 10) {
                    //Остановка анимации
                    clearInterval(id);
                    confirm.style.display = "none"; //убрать блок
                } else {
                    //Логика анимации
                    counter--;
                    confirm.style.transform = `translateY(-${counter}px)`;
                    confirm.style.opacity = "." + counter; //Изменение проразночности
                }
            };
        };

        function calсGoods(i) {
            //Подсчет количество товара в карзине
            const items = cartWrapper.querySelectorAll(".goods__item");
            badge.innerText = (items.length) + i;
        };
        /* Функция считает сумму всех товаров*/
        function calcTotal() {
            const prices = document.querySelectorAll(".cart__wrapper > .goods__item > .goods__price > span");
            let total = 0;
            prices.forEach(function(item) {
                total += +item.innerText;
            });
            totalCost.innerText = total;
        };

        function removeFromcart() {
            /* Функция удаляет с корзины товар*/
            const removeBtn = cartWrapper.querySelectorAll(".goods__item-remove");
            console.log(document.querySelectorAll(".cart__wrapper > .goods__item "));
            removeBtn.forEach(function(btn) {
                btn.addEventListener("click", function() {
                    btn.parentElement.remove();
                    calсGoods(0);
                    calcTotal();
                    var x = document.querySelectorAll(".cart__wrapper > .goods__item");
                    if (x.length == 0) {
                        //Показ текста когда товара нет ДЗ 
                        /* Когда пользователь удаляет весь товар с корзины, программа проверяет условия 
                        если в корзине нет товара то вывожу текст о том что товара нет*/
                        let empty = cartWrapper.querySelector(".empty"); //Обращаюсь к элементу
                        empty.style.display = "block"; //Показываю блок с текстом
                    }

                });
            });
        };
    });
});



// fetch('https://jsonplaceholder.typicode.com/posts', {
//         method: "POST",
//         body: JSON.stringify(example)
//     }) //Промис (обещание), заспрос у сервера
//     .then(response => response.json()) //обещание которое json превратит в обычный объект
//     .then(json => console.log(json)) // Обработка консолью