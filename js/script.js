
const slider = tns({
  container: ".carousel__inner",
  items: 1,
  slideBy: "page",
  autoplay: false, // убрали автоматическое перелистывание слайдов
  controls: false, // убрали кнопки (prev, next)
  nav: false, // убрали точки
  responsive: {
    320: {
      edgePadding: 25,
      gutter: 5,
      nav: true,
      // center: true,
      // preventScrollOnTouch: true,
      mouseDrag: true,
      speed: 1000,
      // autoplay: true,
      // autoplayTimeout: 2000,
    },
    576: {
      nav: true,
      preventScrollOnTouch: true,
      mouseDrag: true,
      speed: 1000,
    },
    768: {
      nav: true,
      // autoplay: true,
      // autoplayTimeout: 4000,
      preventScrollOnTouch: true,
      mouseDrag: true,
      speed: 1000,
    },
    992: {
      nav: false,
    },
  },
});

document.querySelector(".arrow_next").addEventListener("click", function () {
  slider.goTo("next");
});
document.querySelector(".arrow_prev").addEventListener("click", function () {
  slider.goTo("prev");
});

// !создание табов (переключение между ними) на ЧИСТОМ JS
const tabs = document.querySelectorAll(".catalog__tab"); 
const tabsContent = document.querySelectorAll(".catalog__content"); 

tabs.forEach((item) => {
  item.addEventListener("click", () => {
    let currentTab = item;
    let tabId = currentTab.getAttribute("data-tab");
    let descrTab = document.querySelector(tabId);

    tabs.forEach((item) => {
      item.classList.remove("catalog__tab_active");
    });
    tabsContent.forEach((item) => {
      item.classList.remove("catalog__content_active");
    });

    currentTab.classList.add("catalog__tab_active");
    descrTab.classList.add("catalog__content_active");
  });
});


const links = document.querySelectorAll(".catalog-item__link");
const linksBack = document.querySelectorAll(".catalog-item__back");

function toggleSlide(elem) {
  elem.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .querySelectorAll(".catalog-item__content")
        [index].classList.toggle("catalog-item__content_active");
      document
        .querySelectorAll(".catalog-item__list")
        [index].classList.toggle("catalog-item__list_active");
    });
  });
}

toggleSlide(links);
toggleSlide(linksBack);


//! МОДАЛЬНЫЕ ОКНА ЧИСТЫЙ JS
const btnConsult = document.querySelectorAll("[data-modal=consultation");
const btnBuy = document.querySelectorAll(".button_mini");
const closeItem = document.querySelectorAll(".modal__close");
const overlay = document.querySelector(".overlay");
const modalConsul = document.querySelector("#consultation");
const modalThanks = document.querySelector("#thanks");
const modalOrder = document.querySelector("#order");
const consulForm = document.querySelector("#consultation-form");


const fadeIn = (el, timeout, display) => {
  el.style.opacity = 0;
  el.style.display = display || "block";
  el.style.transition = `opacity ${timeout}ms`;
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
};


const fadeOut = (el, timeout) => {
  el.style.opacity = 1;
  el.style.transition = `opacity ${timeout}ms`;
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.display = "none";
  }, timeout);
};

btnConsult.forEach((item) => {
 
  item.addEventListener("click", () => {
    fadeIn(overlay, 1000, "block");
    fadeIn(modalConsul, 500, "block"); 
  });
});

closeItem.forEach((item) => {
  //событие клик на крестики
  item.addEventListener("click", () => {
    document.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
    fadeOut(overlay, 500);
    fadeOut(modalConsul, 500);
    fadeOut(modalOrder, 500);
    fadeOut(modalThanks, 500);
  });
});

btnBuy.forEach((item, index) => {

  item.addEventListener("click", () => {
    fadeIn(overlay, 500, "block");
    fadeIn(modalOrder, 500, "block");

    modalOrder.children[2].textContent = document.querySelectorAll(
      ".catalog-item__subtitle"
    )[index].textContent;

    //!document.querySelectorAll(".catalog-item__subtitle")[index] -  вытаскивает элементы по их индексу при нажатии кнопки, ОБЯЗАТЕЛЬНО У МЕТОДА FOREACH ДОЛЖЕН БЫТЬ ПАРАМЕТР INDEX!!!! (Аналог: eq(index) -JQuery)
  });
});


$(document).ready(function () {
  

  // $.validator.addMethod('LessThan', function(value, element, param){
  //   return parseInt(value) < parseInt(param)
  // }, 'Число больше или равно 100')
  // $.validator.addMethod(
  //   "phoneRU",
  //   function (phone_number, element) {
  //     phone_number = phone_number.replace(/\s+/g, "");
  //     return (
  //       this.optional(element) ||
  //       (
  //         phone_number.match(/^([9]{1}[0-9]{9})?$/))
  //         phone_number.match(/^([7]{1} [0-9]{3}[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2})?$/))

  //     );
  //   },
  //   "Пожалуйста, введите ваш номер телефона"
  // );
  function validateForms(form) {
    $(form).validate({
      rules: {
        name: {
          required: true,
        },
        phone: {
          required: true,
          // phoneRU: true,
          // LessThan: '100'
          // number: true,
        },
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        name: "Поле не заполнено!",
        phone: {
          required: "Поле не заполнено!",
        },
        email: {
          required: "Поле не заполнено!",
          email:
            "Ваш адрес электронной почты должен быть в формате name@domain.com",
        },
      },
    });
    $(".modal__close").on("click", function () {
  
      $("input").removeClass("error");
      $("label").remove();
    });
  }

  validateForms("#consultation-form"); 
  validateForms("#consultation form");
  validateForms("#order form");

  $("input[name=phone]").mask("+7 (999) 999-99-99");

  
}); 


function submitForms(form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    if ($(form).valid()) {
      

      const formData = new FormData(form); 
      const data = Object.fromEntries(formData);
      console.log(data);

      fetch("mailer/smart.php", {
        //запрос на сервер
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json()) 
        .then((data) => {
          console.log(data);
          fadeOut(modalConsul, 100);
          fadeOut(modalOrder, 100);
          fadeIn(overlay, 500, "block");
          fadeIn(modalThanks, 500, "block"); 
          form.reset(); 
        })
        .catch((error) => console.log(error)); 
    }
  });
}

submitForms(consulForm);
submitForms(modalConsul.children[3]);
submitForms(modalOrder.children[3]);



const pageup = document.querySelector(".pageup");

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

document.addEventListener(
  "scroll",
  throttle((e) => {
    if (e.target.scrollingElement.scrollTop > 1400) {
      fadeIn(pageup, 1000);
    } else {
      fadeOut(pageup, 500);
    }
  }, 1000)
);

//!ПЛАВНЫЙ СКРОЛЛ НА МОБ УСТОЙСВАХ с помощью полифилла
// подключить скрипт кода CDN 
//< src="https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll/dist/smooth-scroll.polyfills.min.js">
const scroll = new SmoothScroll('a[href*="#"]', {
	speed: 300
});


//***************************************************************************************************** */
//! АКТИВИРОВАНИЕ ПЛАГИНА, ПОДКЛЮЧЕННОГО В HTML (WOW.js)
new WOW().init();
