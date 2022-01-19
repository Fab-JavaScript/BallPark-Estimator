// url on the locale machine
const base_url = 'http://localhost:8080';
const estimate_url  = base_url + '/estimate_summary';
const fence_url  = base_url + '/fence-type';
const contact_url  = base_url + '/contact_us';

//url on the host
// const base_url = 'https://fenceestimate.mcservices.com';
// const estimate_url  = base_url + '/estimate_summary';
// const fence_url  = base_url + '/fence-type';
// const contact_url  = base_url + '/contact_us';
/*
* this variable is to get the random number
*/
let num;
/**
* this is the launcher when the window loads
*/
const init = () => {
  num = getSum()
  let fenceItems = document.querySelector('#fence-items')
  fenceItems.addEventListener('submit', element => {
    element.preventDefault();
    if(fenceFormValidation()) {
      getEstimate();
    }
  });
  presentElement();
}
/*
* this function hide and display element on the change listener
*/
const presentElement = () => {
  // declaring selectors
  let show_footage = document.querySelector('#show_footage');
  let estimateBtn = document.querySelector('#estimateBtn');
  let input_double = document.querySelector('#f_double');
  let input_single = document.querySelector('#f_single');
  let txtOne = document.querySelector('#txtOne');
  let input_footage = document.querySelector('#f_footage');
  let reloadBtn = document.querySelector('#startbtn');
  let show_color = document.querySelector('#show_color');
  let show_height = document.querySelector('#show_height');

  // always displays type
  let btn_type = document.querySelector('#type');
  btn_type.addEventListener("change", () => {
    //removing class
    show_height.classList.remove('hidden');
    //calling the select function
    select_type();
    // calling the remove function
    let msg_error = removeClass();
    //checking
    if(document.myForm.type.value  == "" ) {
      document.querySelector('#type').classList.add('validation_styling');
      let type_err = document.querySelector('#show_type');
      let message = document.createElement('span');
      message.classList.add(msg_error);
      message.textContent = 'please Select a Type';
      type_err.appendChild(message);
    }
  });
  // show height
  show_height.addEventListener("change", () => {
    // remove class hidde
    show_footage.classList.remove('hidden');
    // calling the remove class
    let msg_error = removeClass();
    // checking
    if( document.myForm.height.value  == "" ) {
      document.querySelector('#height').classList.add('validation_styling');
      let message = document.createElement('span');
      let height_err = document.querySelector('#show_height');
      message.classList.add(msg_error);
      message.textContent = `please Select height`;
      height_err.appendChild(message);
      isSelected = false;
    }
  })
  // display footage
  input_footage.addEventListener("change", () => {
    let footageCheck = document.myForm.footage.value.replace(/[^\d.-]/g, '');
    // calling the remove class
    let msg_error = removeClass();
    // removing hidden class
    show_color.classList.remove('hidden');
    //condition on footage
    if(footageCheck  == "" || footageCheck <= 0) {
      document.querySelector('#f_footage').classList.add('validation_styling');
      let message = document.createElement('span');
      let footage_err = document.querySelector('#show_footage');
      message.classList.add(msg_error);
      message.textContent = `footage must greater than 0`;
      footage_err.appendChild(message);
      isSelected = false;
    }
  });
  // check color selection
  show_color.addEventListener("change", () => {
    // calling the remove class
    let msg_error = removeClass();
    // removing hidden class
    // show_single.classList.remove('hidden');
    gates.classList.remove('hidden');
    estimateBtn.classList.remove('hidden');
    txtOne.classList.remove('hidden');
    // condition check on color
    if( document.myForm.color.value == "" ) {
      document.querySelector('#color').classList.add('validation_styling');
      let message = document.createElement('span');
      let color_err = document.querySelector('#show_color');
      message.classList.add(msg_error);
      message.textContent = `please Select a Color`;
      color_err.appendChild(message);
      isSelected = false;
    }
  });
  //check on the change event listener
  input_single.addEventListener('change', () => {
    let err_msg = document.querySelector('.singleFailure');
    let singleCheck = document.myForm.single.value.replace(/[^\d.-]/g, '');
    // calling the remove class
    let msg_error = removeClass();
    // condition check on single gate
    if(singleCheck < 0) {
      document.querySelector('#f_single').classList.add('validation_styling');
      let message = document.createElement('span');
      message.classList.add(msg_error);
      message.textContent = 'Negative Numbers are not Allowed';
      err_msg.appendChild(message);
      isSelected = false;
    }
  });
  // check on the change listener on double
  input_double.addEventListener('change', () => {
    let err_msg = document.querySelector('.doubleFailure');
    let doubleCheck = document.myForm.double.value.replace(/[^\d.-]/g, '');
    // calling the remove class
    let msg_error = removeClass();
    // conditon check on double gate
    if(doubleCheck < 0) {
      document.querySelector('#f_double').classList.add('validation_styling');
      let message = document.createElement('span');
      message.classList.add(msg_error);
      message.textContent = `Negative Numbers are not Allowed`;
      err_msg.appendChild(message);
      isSelected = false;
    }
  })
  // this will reload the button start over
  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  })
}
/*
* this function get Estimate
*/
const getEstimate = () => {
  // selecting html tag to send to the server
  let btn_estimate = document.querySelector('#estimate');
  let f_type = document.querySelector('#type');
  let f_height = document.querySelector('#height');
  let f_color = document.querySelector('#color');

  let f_single = document.querySelector('#f_single');
  let f_double= document.querySelector('#f_double');
  let f_footage= document.querySelector('#f_footage');

  // getting values entered by users
  let value_single = f_single.value.replace(/[^\d.-]/g, '');
  let value_double = f_double.value.replace(/[^\d.-]/g, '');
  let value_footage= f_footage.value.replace(/[^\d.-]/g, '');

  // getting values entered by users
  let value_type = f_type.value;
  let value_height = f_height.value;
  let value_color = f_color.value;
  //
  let obj = {
    'type'    : value_type,
    'height'  : value_height,
    'color'   : value_color,
    'single'  : value_single,
    'double'  : value_double,
    'footage' : value_footage
  }
  // getting data from api post and sending it back to the server
  const callback = data => {
    let usersData = JSON.parse(data);
    console.log(usersData);
    removeField();
    displayEstimate(usersData);
    sendEmail(usersData);
    displayContactForm();
  }
  makeAjaxRequest(estimate_url, callback, obj);
  output_report();
}
/*
*
*/
const select_type = () => {
  let btn_type = document.querySelector('#type');
  let value_type = btn_type.value;
  console.log(value_type);
  const callback = data => {
    let info = JSON.parse(data);
    console.log(info);
    displayHeight(info);
    displaycolor(info);
  }
  makeAjaxRequest(fence_url, callback, {"name":value_type});
}
/*
*
*/
const makeAjaxRequest = (url, callback, obj) => {
   let xhr = new XMLHttpRequest();
   xhr.open("post", url);
   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.addEventListener("readystatechange", () => {
       if(xhr.readyState == 4 && xhr.status == 200) {
           if(xhr.responseXML) {
               callback(xhr.responseXML);
           } else {
               callback(xhr.responseText);
           }
       }
   });
   xhr.send(JSON.stringify(obj));
};
/*
 * display height on the select option
*/
const displayHeight = data => {
  let select_height = document.querySelector('#height');
  select_height.innerHTML = "<option value=''>Fence Height</option>";

  data.height.map(compoments => {
    let option_height = document.createElement('option')
    option_height.setAttribute('value', `${compoments.fence_height}`);
    option_height.textContent = `${compoments.fence_height}'`;
    select_height.appendChild(option_height);
  })
}
/*
 * display height on the select option
*/
const displaycolor = data => {
  let select_color= document.querySelector('#color');
  select_color.innerHTML = "<option value=''>Fence Color</option>";

  data.color.map(compoments => {
    let option_color = document.createElement('option');
    option_color.setAttribute('value', `${compoments.fence_color}`);
    option_color.textContent = `${compoments.fence_color}`
    select_color.appendChild(option_color);
  })
}

/*
* display Estimate
*/
const displayEstimate = data => {
  let esti = document.querySelector('.estistyling')
  let txt2 = document.querySelector('#textTwo')
  let outputReport = document.querySelector('.outputReport')
  let output = document.querySelector("#output");
  // create Element
  let f_para2 = document.createElement('p');
  let header2 = document.createElement('h2');
  header2.className = 'list-group-item active';
  header2.setAttribute("aria-current", "true");
  let s_ul = document.createElement('ul')
  s_ul.className = 'list-group';
  let s_type = document.createElement('li');
  s_type.className = 'list-group-item';
  s_type.id = 'list-type';
  let s_height = document.createElement('li');
  s_height.className = 'list-group-item';
  s_height.id = 'list-height';
  let s_color = document.createElement('li');
  s_color.className = 'list-group-item';
  s_color.id = 'list-color';
  let s_single = document.createElement('li');
  s_single.className = 'list-group-item';
  s_single.id = 'list-single';
  let s_double = document.createElement('li');
  s_double.className = 'list-group-item';
  s_double.id = 'list-double';
  let s_footage = document.createElement('li');
  s_footage.className = 'list-group-item';
  s_footage.id = 'list-footage';
  let s_total = document.createElement('h3');
  s_total.className = 'list-group-item active';
  f_para2.textContent = `**Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
      when an unknown printer took a galley of type and scrambled it to make a type specimen book.
      It has survived not only five centuries, but also the leap into electronic typesetting,
      remaining essentially unchanged.`;

  // Assign Content to the elements
  header2.textContent = 'Materials Selected';
  header2.style.fontSize = "25px";
  header2.style.backgroundColor = '#004e6e';
  s_type.innerHTML = `Type : <b>${data.type}</b>`;
  s_height.innerHTML = `Height : <b>${data.height}'</b>`;
  s_color.innerHTML = `Color : <b>${data.color}</b>`;
  s_single.innerHTML = `Single : <b>${data.single}</b>`;
  s_double.innerHTML = `Double : <b>${data.double}</b>`;
  s_footage.innerHTML = `Footage : <b>${data.footage}'</b>`;
  s_total.textContent = `Estimate: $${data.total}`;
  s_total.style.fontSize = "20px";
  s_total.style.backgroundColor = '#004e6e';

  // append elements
  s_ul.appendChild(header2);
  s_ul.appendChild(s_type);
  s_ul.appendChild(s_height);
  s_ul.appendChild(s_color);
  s_ul.appendChild(s_single);
  s_ul.appendChild(s_double);
  s_ul.appendChild(s_footage);
  s_ul.appendChild(s_total);

  // append to div = output
  output.appendChild(s_ul);
  txt2.appendChild(f_para2)
  esti.appendChild(output);
  outputReport.appendChild(txt2);
  outputReport.appendChild(esti);
}
/**
*remove fields
**/
const removeField = () => {
    let formContainer = document.querySelector('.form-container');
    let txtOne = document.querySelector('#txtOne');
    formContainer.remove();
    txtOne.remove();
}
const output_report = () => {
  let summaryCol = document.querySelector('.hiddenReport');
  summaryCol.classList.remove('hiddenReport');

}
const displayContactForm = () => {
  let btn_contact = document.querySelector('#contactBtn');
  let form = document.querySelector('.contact-container');
  btn_contact.addEventListener('click', () => {
    form.classList.remove('contact-container');// removed the materials selected
    document.querySelector('#outputContact').scrollIntoView({behavior: 'smooth'}); // bring the contact form up
    displayCaptcha(num);
  })
}

const sendEmail = f_obj => {
  let formBtn = document.querySelector('#contact-form');
  let answer = document.querySelector('#ans');
  // selecting html tag on the form to send to the server
  let c_name = document.querySelector('#name');
  let c_email = document.querySelector('#email');
  let c_phone = document.querySelector('#phone');
  let c_address = document.querySelector('#address');
  let c_city = document.querySelector('#city');
  let c_zipcode = document.querySelector('#zipcode');
  let c_msg = document.querySelector('#message');

  formBtn.addEventListener('submit', e => {
    e.preventDefault();
    //
    let formData = {
      'name'      : c_name.value,
      'email'     : c_email.value,
      'phone'     : c_phone.value,
      'address'   : c_address.value,
      'city'      : c_city.value,
      'zipcode'   : c_zipcode.value,
      'message'   : c_msg.value,
      'estimate'  : f_obj,
      'captcha'   : num,
      'captcha_answer' : answer.value
    };
    console.log(formData);
    console.log(answer);

    let message = document.querySelector('.captchamessage');
    let span_msg = document.createElement('span')
    message.innerHTML = "";
    answer.value = "";
    //callback
    const callback = data => {
      data = JSON.parse(data)
      console.log(data);
      if(!data.success) {
        // data.message
        span_msg.textContent = `${data.message}`
        message.appendChild(span_msg);
        span_msg.style.color ='red';
        answer.style.border ='2px solid red';
        num = getSum();
        displayCaptcha(num);
      } else {
        // alert(data.message);
        span_msg.textContent = `${data.message}`
        message.appendChild(span_msg);
        span_msg.style.color ='orange';
        answer.style.border ='2px solid orange';
        displayModal();
      }
    };
    makeAjaxRequest(contact_url, callback, formData);
  })
}
/**
* this function checks Materials selected input
*/
const fenceFormValidation = () => {
  // calling the remove function
  let msg_error = removeClass();
  let footageCheck = document.myForm.footage.value.replace(/[^\d.-]/g, '');
  let singleCheck = document.myForm.single.value.replace(/[^\d.-]/g, '');
  let doubleCheck = document.myForm.double.value.replace(/[^\d.-]/g, '');
  // condition check on type
  if( document.myForm.type.value  == "" ) {
    document.querySelector('#type').classList.add('validation_styling');
    let type_err = document.querySelector('#show_type');
    let message = document.createElement('span');
    message.classList.add(msg_error);
    message.textContent = 'please Select a Type';
    type_err.appendChild(message);
    isSelected = false;
  }
  // condition check on heigh
  if( document.myForm.height.value  == "" ) {
    document.querySelector('#height').classList.add('validation_styling');
    let message = document.createElement('span');
    let height_err = document.querySelector('#show_height');
    message.classList.add(msg_error);
    message.textContent = `please Select height`;
    height_err.appendChild(message);
    isSelected = false;
  }
  //condition on footage
  if(footageCheck == "" || footageCheck < 0) {
    document.querySelector('#f_footage').classList.add('validation_styling');
    let message = document.createElement('span');
    let footage_err = document.querySelector('#show_footage');
    message.classList.add(msg_error);
    message.textContent = `footage must greater than 0`;
    footage_err.appendChild(message);
    isSelected = false;
  }
  // condition check on color
  if( document.myForm.color.value == "" ) {
    document.querySelector('#color').classList.add('validation_styling');
    let message = document.createElement('span');
    let color_err = document.querySelector('#show_color');
    message.classList.add(msg_error);
    message.textContent = `please Select a Color`;
    color_err.appendChild(message);
    isSelected = false;
  }
  // condition check on single gate
  if(singleCheck < 0) {
    document.querySelector('#f_single').classList.add('validation_styling');
    let message = document.createElement('span');
    let err_msg = document.querySelector('.singleFailure');
    message.classList.add(msg_error);
    message.textContent = 'Negative Numbers are not Allowed';
    err_msg.appendChild(message);
    isSelected = false;
  }
  // conditon check on double gate
  if(doubleCheck < 0) {
    document.querySelector('#f_double').classList.add('validation_styling');
    let err_msg = document.querySelector('.doubleFailure');
    let message = document.createElement('span');
    message.classList.add(msg_error);
    message.textContent = `Negative Numbers are not Allowed`;
    err_msg.appendChild(message);
    isSelected = false;
  }
  return isSelected;
}
/*
* this function remove class and div when they exist on the page
*/
const removeClass = () => {
  isSelected = true;
  let msg_error = 'msg_error';
  let validation_styling = document.querySelectorAll('.validation_styling');
  if(validation_styling.length > 0 ) {
    validation_styling.forEach(item => {
      item.classList.remove('validation_styling');
    });
  }
  let msg_styling = document.querySelectorAll('.msg_error');
  if(msg_styling.length > 0 ) {
    msg_styling.forEach(item => {
      item.remove();
    });
  }
  return msg_error;
}
/**
* this function get random number
*/
const getSum = numObj => {
  let randomNum1 = getRandomNum();
  let randomNum2 = getRandomNum();
  numObj = {
      'num1' : randomNum1,
      'num2' : randomNum2
  }
  return numObj;
}
/*
* this function generate the random number
*/
const getRandomNum = () => {
  let numbers = Math.floor(Math.random() * 20);
  return numbers;
}
/*
* this function display the captcha on the form
*/
const displayCaptcha = data => {
  let captcha = document.querySelector('.captchaContainer')
  let num = document.createElement('label');
  let shownum = document.querySelector('.showNum');
  shownum.innerHTML = "";
  str = `${data.num1} + ${data.num2} =`;
  console.log(str);
  num.textContent = str;
  shownum.appendChild(num);
  captcha.appendChild(shownum);
}
/*
* this function display modal
*/
const displayModal = () => {
  console.log('trigger Modal .......');
  let modal = document.querySelector('.modal');
  let currentState = modal.style.display;
  // If modal is visible, hide it. Else, display it.
  if (currentState === 'none') {
    modal.style.display = 'block';

  } else {
    modal.style.display = 'none';
    // detachModalListeners(modal);
  }
  attachModalListeners(modal);
}
//
const attachModalListeners = modalElm => {
  modalElm.querySelector('.close_modal').addEventListener('click', () => {
    window.location.href = "/";
  });
}
window.addEventListener("load", init);
