var helper = {
  get_current_user: function () {
    if (localStorage.userToken) {
      return localStorage.userToken;
    }
    return false;
  },
  logOut: function(){
    localStorage.removeItem('userToken');
    window.open('index.html', '_self', 'location=yes');
  },
  open_ntermin3page: function(categ_id){
    localStorage.provider_category_id = categ_id;
    localStorage.provider_category_name = $('.provider_categ_btn[data-id="'+categ_id+'"]').text();
    window.open('ntermin3.html', '_self', 'location=yes');
  },
  service_select: function(service_id, service_name,navigate){
    localStorage.current_service_id = service_id;
    localStorage.current_service_name = service_name;
    localStorage.removeItem('current_service_description');
    $('.step2text').text(service_name);
    if(navigate === true) {
      this.go_to_calendar();
    }
  },
  add_service_description: function(desc){
    if(desc != '') {
      localStorage.current_service_description = desc;
      this.go_to_calendar();
    }else{
      navigator.notification.alert(
        'Please add service description!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
    }
  },
  go_to_calendar: function(){
    if(localStorage.current_service_id){
      window.open('calendar.html', '_self', 'location=yes');
    }else{
      navigator.notification.alert(
        'Please select a service!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
    }
  }
};
var service = {
  user_register: function (firstname, lastname, email, pswd, cpswd) {
    if(firstname == '' || lastname == '' || email == '' || pswd == '' || cpswd == ''){
      navigator.notification.alert(
        'All fields are mandatory!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    if($('#terms-checkbox').prop('checked') == false){
      navigator.notification.alert(
        'You must agree to terms!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    if(pswd != cpswd){
      navigator.notification.alert(
        'Passwords does not match!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/RegisterUser',
      type: 'POST',
      data: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: pswd,
        bussinessName: '',
        locality: '',
        types: []
      }),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        if (data.AuthenticationResult.AuthStatus == "1") { //if success
          localStorage.userToken = data.AuthenticationResult.Token;
          window.open('ntermin.html', '_self', 'location=yes');
        } else {
          navigator.notification.alert(
            data.AuthenticationResult.Message,  // message
            function(){},         // callback
            'Warning',            // title
            'Ok'                  // buttonName
          );
        }
      },
      error: function (err) {
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  user_login: function (email, pswd) {
    if(email == '' || pswd == ''){
      navigator.notification.alert(
        'Both fields are mandatory!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/Login',
      type: 'POST',
      data: JSON.stringify({
        username: email,
        password: pswd
      }),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        if (data.AuthenticationResult.AuthStatus == "1") { //if success
          localStorage.userToken = data.AuthenticationResult.Token;
          window.open('ntermin.html', '_self', 'location=yes');
        } else {
          navigator.notification.alert(
            data.AuthenticationResult.Message,  // message
            function(){},         // callback
            'Warning',            // title
            'Ok'                  // buttonName
          );
        }
      },
      error: function (err) {
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  get_bookings_for_user: function (token) {
    if (!token) {
      token = localStorage.userToken;
    }
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetFullCallendarBookingsCustomer',
      type: 'GET',
      data: {Token: token},
      success: function (data) {
        if (data.Status == 1) {
          var start_date = eval("new " + data.BookingsList[1].StartDate.slice(1, -1));
          var moment_date = moment(start_date);
          $(".ntermin .date-post").text(moment_date.format('l'));//data
          $(".ntermin .time-hr").text(moment_date.format('hh:mm'));//ora
          $(".ntermin .behandlung").text(data.BookingsList[0].ServiceName);//medic

          var html_history = '';
          $.each(data.BookingsList, function(index, elem){
            start_date = eval("new " + elem.StartDate.slice(1, -1));
            moment_date = moment(start_date);

            html_history += '<div class="alert alert-warning" role="alert">';
            html_history += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            html_history += '<img src="img/tic.png" alt="Tooth-Icon" class="notification-icon" />';
            html_history += '<table class="notification-text">';
            html_history += '<tr>';
            html_history += '<td class="op">Datum:</td>';
            html_history += '<td class="opval">'+moment_date.format('l')+'</td>';
            html_history += '</tr>';
            html_history += '<tr>';
            html_history += '<td class="op">Uhr:</td>';
            html_history += '<td class="opval">'+moment_date.format('hh:mm')+'</td>';
            html_history += '</tr>';
            html_history += '<tr>';
            html_history += '<td class="op">Hausarzt:</td>';
            html_history += '<td class="opval">'+elem.ServiceName+'</td>';
            html_history += '</tr>';
            html_history += '</table>';
            html_history += '</div>';
          });

          $('.notification-wrapper.termine_page').append(html_history);
        }

      },
      error: function (err) {
        console.log(err);
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  getAllCategories: function(){
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetAllCategories',
      type: 'GET',
      success: function (data) {
        if (data.Status == 1) {
          var html = '';
          $.each(data.SearchCategory,function(index,elem){
            console.log(elem);
            html += '<div class="col-xs-6 "><button class="btn-default btn-choice provider_categ_btn" data-id="'+elem.Id+'" onclick="helper.open_ntermin3page('+elem.Id+');"><img src="img/mficon.png">'+elem.DefaultName+'</button></div>';
          });
          $('.categories_container').append(html);
        }

      },
      error: function (err) {
        console.log(err);
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  GetProviderServiceCategories: function(){
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetProviderServiceCategories',
      type: 'GET',
      data: {name: 'Dr-Silvana-Scherb'},
      success: function (data) {
        console.log('GetProviderServiceCategories',data);
        if (data.Status == 1) {
          var html = '';
          $.each(data.ServiceCategoryList,function(index,elem){
            html += '<button class="btn-ghost btn-l" onclick="service.GetServicesByCategory('+elem.Id+');">'+elem.Name+'</button>';
          });
          $('.btn-list.service_categories').append(html);
        }

      },
      error: function (err) {
        console.log(err);
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  GetServicesByCategory: function(Id){
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetServicesByCategory',
      type: 'GET',
      data: {id: Id},
      success: function (data) {
        console.log('GetServicesByCategory',data);
        if (data.Status == 1) {
          if(data.ServiceList.length > 1){//has services
            var html = '';
            $.each(data.ServiceList, function(index, elem){
              html += '<li><button class="btn-nstyle" onclick="helper.service_select('+elem.Id+',\'' + elem.Name + '\', true);">'+elem.Name+'</button></li>';
            });
            //modal-list
            $('#has_service_modal .modal-list').html('');
            $('#has_service_modal .modal-list').append(html);
            $('#has_service_modal').modal().show();
          }else{//no service
            helper.service_select(data.ServiceList[0].Id,data.ServiceList[0].Name);
            $('#no_service_modal .modal-header .modal-title').text(data.ServiceList[0].Name);
            $('#no_service_modal').modal().show();
          }
        }
      },
      error: function (err) {
        console.log(err);
        navigator.notification.alert(
          'Error',  // message
          function(){},         // callback
          'Warning',            // title
          'Ok'                  // buttonName
        );
      }
    });
  }
};