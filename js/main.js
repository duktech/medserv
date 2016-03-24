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
  }
};
var service = {
  user_register: function (firstname, lastname, email, pswd, cpswd) {
    if(firstname == '' || lastname == '' || email == '' || pswd == '' || cpswd == ''){
      navigator.notification.alert(
        'Warning',  // message
        function(){},         // callback
        'All fields are mandatory!',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    if($('#terms-checkbox').prop('checked') == false){
      navigator.notification.alert(
        'Warning',  // message
        function(){},         // callback
        'You must agree to terms!',            // title
        'Ok'                  // buttonName
      );
      return 0;
    }
    if(pswd != cpswd){
      navigator.notification.alert(
        'Warning',  // message
        function(){},         // callback
        'Passwords does not match!',            // title
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
            'Warning',  // message
            function(){},         // callback
            data.AuthenticationResult.Message,            // title
            'Ok'                  // buttonName
          );
        }
      },
      error: function (err) {
        navigator.notification.alert(
          'Warning',  // message
          function(){},         // callback
          'Error',            // title
          'Ok'                  // buttonName
        );
      }
    });
  },
  user_login: function (email, pswd) {
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
            'Warning',  // message
            function(){},         // callback
            data.AuthenticationResult.Message,            // title
            'Ok'                  // buttonName
          );
        }
      },
      error: function (err) {
        navigator.notification.alert(
          'Warning',  // message
          function(){},         // callback
          'Error',            // title
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
          'Warning',  // message
          function(){},         // callback
          'Error',            // title
          'Ok'                  // buttonName
        );
      }
    });
  }
};