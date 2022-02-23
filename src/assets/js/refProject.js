function inputJs() {
  let formFieldInputs = document.querySelectorAll('.form-fill input');

  for (let i = 0; i < formFieldInputs.length; i++) {
    let input = formFieldInputs[i];

    if (input.value !== "") {
      input.classList.add('active');
    }

    input.addEventListener("focusout", function () {
      if (this.value !== "") {
        this.classList.add("active");
      } else {
        this.classList.remove("active");
      }
    });

  }

  let formFieldTextAreas = document.querySelectorAll('.form-fill textarea');

  for (let i = 0; i < formFieldTextAreas.length; i++) {
    let textarea = formFieldTextAreas[i];

    if (textarea.value !== "") {
      textarea.classList.add('active');
    }

    textarea.addEventListener("focusout", function () {

      if (this.value !== "") {
        this.classList.add("active");
      } else {
        this.classList.remove("active");
      }
    });
  }
}

function headerSection() {
  // header sticky
  const selectHeader = document.querySelector('#header');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      window.scrollY > 0 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
    });
  }


  /**
   * Mobile nav toggle
   */
  const mobileNavToogle = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToogle) {
    mobileNavToogle.addEventListener('click', function (event) {
      event.preventDefault();

      document.querySelector('body').classList.toggle('mobile-nav-active');

      // remove active dropdowns
      let activeADropdowns = document.querySelectorAll('.navbar .active');
      let activeDropdowns = document.querySelectorAll('.navbar .dropdown-active');

      activeADropdowns.forEach(element => {
        element.classList.remove('active');
      });

      activeDropdowns.forEach(element => {
        element.classList.remove('dropdown-active');
      });


      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  /**
   * Toggle mobile nav dropdowns
   */
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach(el => {
    el.addEventListener('click', function (event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        let dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    })
  });
}

function heroSliderSection() {
  let heroCarouselIndicators = document.querySelector('#hero .carousel-indicators');
  if (heroCarouselIndicators) {
    let heroCarouselItems = document.querySelectorAll('#hero .carousel-item')

    heroCarouselItems.forEach((item, index) => {
      if (index === 0) {
        heroCarouselIndicators.innerHTML += `<li data-bs-target="#hero" data-bs-slide-to="${index}" class="active"></li>`;
      } else {
        heroCarouselIndicators.innerHTML += `<li data-bs-target="#hero" data-bs-slide-to="${index}"></li>`;
      }
    });
  }
}

function newEl(tag, attrs) {
  let e = document.createElement(tag);
  if (attrs !== undefined) Object.keys(attrs).forEach(k => {
    if (k === 'class') {
      Array.isArray(attrs[k])
        ? attrs[k].forEach(o => o !== '' ? e.classList.add(o) : 0)
        : (attrs[k] !== '' ? e.classList.add(attrs[k]) : 0);
    } else if (k === 'style') {
      Object.keys(attrs[k]).forEach(ks => {
        e.style[ks] = attrs[k][ks];
      });
    } else if (k === 'text') {
      attrs[k] === '' ? e.innerHTML = '&nbsp;' : e.innerText = attrs[k];
    } else e[k] = attrs[k];
  });
  return e;
}

function selectDropdown() {
  document.querySelectorAll("select:not([multiple])").forEach((el) => {

    let div = newEl('div', {
      class: 'select-dropdown'
    });

    // add id to div while select had id
    if (el.hasAttribute('id')) {
      div.setAttribute('id', el.attributes['id'].value + '-select');
    }

    if (el.hasAttribute('isDone')) {
      return;
    }

    if (!el.hasAttribute('set')) {
      return;
    }

    // add attr to select that select is done
    el.setAttribute('isDone', '');


    el.style.display = 'none';
    el.parentNode.insertBefore(div, el.nextSibling);
    let listWrap = newEl('div', {
      class: 'select-dropdown-list-wrapper'
    });
    let list = newEl('div', {
      class: 'select-dropdown-list'
    });
    let search = newEl('input', {
      class: ['select-dropdown-search'],
      placeholder: 'جستجو'
    });

    // search attr
    if (el.hasAttribute('search')) {
      search.style.display = el.attributes['search'].value === 'true' ? 'block' : 'none';
    }


    listWrap.appendChild(search);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    el.loadOptions = () => {
      list.innerHTML = '';


      Array.from(el.options).map(o => {
        let op = newEl('div', {
          optEl: o
        });

        op.appendChild(newEl('label', {
          text: o.text
        }));

        op.addEventListener('click', () => {

          op.optEl.selected = !!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));


        });


        list.appendChild(op);

      });

      div.listEl = listWrap;

      div.refresh = () => {
        div.querySelectorAll('span.optext, span.placeholder').forEach(t => div.removeChild(t));
        let sels = Array.from(el.selectedOptions);

        sels.map(x => {
          let c = newEl('span', {
            class: 'optext',
            text: x.text
          });
          div.appendChild(c);
        });
      };
      div.refresh();
    }
    el.loadOptions();

    search.addEventListener('input', () => {
      list.querySelectorAll("div").forEach(d => {
        let txt = d.querySelector("label").innerText.toUpperCase();
        d.style.display = txt.includes(search.value.toUpperCase()) ? 'block' : 'none';
      });

      let filteredItem = list.querySelectorAll('div[style="display: block;"]');


      let notFound = list.querySelector("h3");

      if (filteredItem.length === 0) {
        if (notFound == null) {
          list.appendChild(newEl('h3', {
            class: 'not-found',
            text: 'نتیجه ای یافت نشد'
          }));
        }
      } else {
        if (notFound != null) {
          list.removeChild(notFound);
        }
      }


    });

    div.addEventListener('click', () => {
      div.listEl.classList.toggle('d-block');
      search.focus();
      search.select();
      div.refresh();
    });
  });
}

// this function is for add select option
function addSelectList(select, selectDropdown, itemValue, itemText) {
  // create new option for select
  let opt = document.createElement('option');
  opt.value = itemValue;
  opt.innerHTML = itemText;
  select.appendChild(opt);
  // create new option for select dropDown
  let op = newEl('div', {
    optEl: opt
  });
  op.appendChild(newEl('label', {
    text: opt.text
  }));
  op.addEventListener('click', function () {
    op.optEl.selected = !!!op.optEl.selected;
    select.dispatchEvent(new Event('change'));
  });
  selectDropdown.appendChild(op);
}

// refresh dropdown
function selectRefresh(select, dropDown) {
  let optext = dropDown.querySelector('span.optext');
  dropDown.removeChild(optext);
  let sel = select.selectedOptions[0];
  let c = newEl('span', {
    "class": 'optext',
    text: sel.text
  });
  dropDown.appendChild(c);
}

function updateSelectDropdown(selectId, values) {

  let select = document.getElementById(selectId);
  // dropDown
  let selectDropDown = document.getElementById(selectId + '-select');
  // dropDown Options
  let selectDropDownList = selectDropDown.querySelector('.select-dropdown-list');
  if (values.length > 0) {
    // make empty the select
    select.querySelectorAll('*').forEach(function (n) {
      return n.remove();
    });
    selectDropDownList.querySelectorAll('*').forEach(function (n) {
      return n.remove();
    });
    values.forEach(function (element) {
      addSelectList(select, selectDropDownList, element.value, element.name);
    });
    selectRefresh(select, selectDropDown);
  }
}

function multiSelectDropdown() {

  document.querySelectorAll("select[multiple]").forEach((el, k) => {

    var div = newEl('div', {
      class: 'multiselect-dropdown'
    });

    if (el.hasAttribute('isDone')) {
      return;
    }

    if (!el.hasAttribute('set')) {
      return;
    }

    // add id to div while select had id
    if (el.hasAttribute('id')) {
      div.setAttribute('id', el.attributes['id'].value + '_select');
    }


    // add attr to select that select is done
    el.setAttribute('isDone', '');

    el.style.display = 'none';
    el.parentNode.insertBefore(div, el.nextSibling);
    var listWrap = newEl('div', {
      class: 'multiselect-dropdown-list-wrapper'
    });
    var list = newEl('div', {
      class: 'multiselect-dropdown-list'
    });
    var search = newEl('input', {
      class: ['multiselect-dropdown-search'],
      placeholder: 'جستجو'
    });


    // search attr
    if (el.hasAttribute('search')) {
      search.style.display = el.attributes['search'].value === 'true' ? 'block' : 'none';
    }


    listWrap.appendChild(search);
    div.appendChild(listWrap);
    listWrap.appendChild(list);

    el.loadOptions = () => {
      list.innerHTML = '';

      if (el.hasAttribute('select-all')) {
        if (el.attributes['select-all'].value == 'true') {
          selectAllBox();
        }
      } else {
        selectAllBox();
      }

      function selectAllBox() {
        var op = newEl('div',
          {
            class: 'multiselect-dropdown-all-selector'
          });
        var ic = newEl('input', {
          type: 'checkbox'
        });
        op.appendChild(ic);
        op.appendChild(newEl('label', {
          text: "انتخاب همه"
        }));

        op.addEventListener('click', () => {
          op.querySelector("input").checked = !op.querySelector("input").checked;

          var ch = op.querySelector("input").checked;
          list.querySelectorAll("input").forEach(i => i.checked = ch);

          Array.from(el.options).map(x => x.selected = ch);

          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click', (ev) => {
          ic.checked = !ic.checked;
        });

        list.appendChild(op);
      }


      Array.from(el.options).map(o => {
        var op = newEl('div', {
          class: o.selected ? 'checked' : '',
          optEl: o
        })
        var ic = newEl('input', {
          type: 'checkbox',
          checked: o.selected
        });
        op.appendChild(ic);
        op.appendChild(newEl('label', {
          text: o.text
        }));

        op.addEventListener('click', () => {
          op.querySelector("input").checked = !op.querySelector("input").checked;
          op.optEl.selected = !!!op.optEl.selected;
          el.dispatchEvent(new Event('change'));
        });
        ic.addEventListener('click', (ev) => {
          ic.checked = !ic.checked;
        });

        list.appendChild(op);
      });
      div.listEl = listWrap;

      div.refresh = () => {
        div.querySelectorAll('span.optext, span.placeholder').forEach(t => div.removeChild(t));

        var sels = Array.from(el.selectedOptions);
        if (sels.length > 3) {
          div.appendChild(newEl('span', {
            class: ['optext', 'maxselected'],
            text: sels.length + ' ' + 'انتخاب شده'
          }));
        } else {
          sels.map(x => {
            var c = newEl('span', {
              class: 'optext',
              text: x.text
            });
            div.appendChild(c);
          });
        }

        var placeholder = "انتخاب کنید";

        if (el.hasAttribute('placeholder')) {
          placeholder = el.attributes['placeholder'].value;
        }


        if (0 === el.selectedOptions.length) {
          div.appendChild(newEl('span', {
            class: 'placeholder',
            text: placeholder
          }));
        }


      };
      div.refresh();
    }
    el.loadOptions();

    search.addEventListener('input', () => {
      list.querySelectorAll("div").forEach(d => {
        var txt = d.querySelector("label").innerText.toUpperCase();
        d.style.display = txt.includes(search.value.toUpperCase()) ? 'block' : 'none';
      });


      var filteredItem = list.querySelectorAll('div[style="display: block;"]');


      var notFound = list.querySelector("h3");

      if (filteredItem.length == 0) {
        if (notFound == null) {
          list.appendChild(newEl('h3', {
            class: 'not-found',
            text: 'نتیجه ای یافت نشد'
          }));
        }
      } else {
        if (notFound != null) {
          list.removeChild(notFound);
        }
      }
    });

    div.addEventListener('click', () => {
      div.listEl.style.display = 'block';
      search.focus();
      search.select();
    });

    document.addEventListener('click', function (event) {
      if (!div.contains(event.target)) {
        listWrap.style.display = 'none';
        div.refresh();
      }
    });
  });
}

function setButtonSniper(selector) {

  let btn = document.querySelector(selector);

  btn.classList.add('button-loading');
}

function removeButtonSniper(selector) {
  let btn = document.querySelector(selector);

  btn.classList.remove('button-loading');
}
