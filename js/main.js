var helper = {
  set_calendar_active_days: function(days){
    setTimeout(function(){
      $.each(days, function(index, elem){
        switch(elem){
          case 1:
            $('.responsive-calendar .day.mon.today').addClass('active');
            $('.responsive-calendar .day.mon.future').addClass('active');
            break;
          case 2:
            $('.responsive-calendar .day.tue.today').addClass('active');
            $('.responsive-calendar .day.tue.future').addClass('active');
            break;
          case 3:
            $('.responsive-calendar .day.wed.today').addClass('active');
            $('.responsive-calendar .day.wed.future').addClass('active');
            break;
          case 4:
            $('.responsive-calendar .day.thu.today').addClass('active');
            $('.responsive-calendar .day.thu.future').addClass('active');
            break;
          case 5:
            $('.responsive-calendar .day.fri.today').addClass('active');
            $('.responsive-calendar .day.fri.future').addClass('active');
            break;
          case 6:
            $('.responsive-calendar .day.sat.today').addClass('active');
            $('.responsive-calendar .day.sat.future').addClass('active');
            break;
          case 7:
            $('.responsive-calendar .day.sun.today').addClass('active');
            $('.responsive-calendar .day.sun.future').addClass('active');
            break;
        }
      });
    },100);
  },
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
  },
  go_to_schedule: function(){
    if(localStorage.selectedDate && localStorage.dailySchedule){
      window.open('schedule.html', '_self', 'location=yes');
    }else{
      navigator.notification.alert(
        'Please select a date!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
    }
  },
  go_to_sumar: function(){
    if(localStorage.selectedHour){
      window.open('sumar.html', '_self', 'location=yes');
    }else{
      navigator.notification.alert(
        'Please select a hour!',  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
    }
  },
  showHours: function(){
    var dailySchedule = JSON.parse(localStorage.dailySchedule);

    var html = '';
    var service_duration = localStorage.service_duration;
    $.each(dailySchedule, function(index, elem){
      html += '<tr>';
      var cclass = 'nava';
      var disabled = 'disabled';
      if(elem.IsAvailable){
        cclass = 'ava';
        disabled = '';
      }
      var start_date = eval("new " + elem.Time.slice(1, -1));
      var moment_date = moment(start_date);

      html += '<td><div class="'+cclass+'"></div><a href="#" class="time-hr cnone '+disabled+'" data-time="'+elem.Time+'" data-duration="'+service_duration+'">'+elem.TimeToString+'</a></td>';
      html += '<td class="my_schedule_hour" data-time="'+elem.Time+'" data-duration="'+service_duration+'"></td>';
      html += '</tr>';
    });
    $('.schedule-tab').append(html);
    $('.schedule-tab .cnone').click(function(){
      if($(this).hasClass('disabled')){
        return 0;
      }
      $('.schedule-tab .cnone').removeClass('active');
      $(this).addClass('active');
      localStorage.selectedHour = $(this).attr('data-time');
    });
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
        console.log(data.BookingsList);
        if (data.Status == 1) {

          data.BookingsList.sort(function(a,b){
            var start_date_a = eval("new " + a.StartDate.slice(1, -1));
            var moment_date_a = moment(start_date_a);

            var start_date_b = eval("new " + b.StartDate.slice(1, -1));
            var moment_date_b = moment(start_date_b);

            if(moment_date_a.isBefore(moment_date_b)){
              return -1;
            }
            if(moment_date_a.isAfter(moment_date_b)){
              return 1;
            }
            return 0;
          });

          var is_first_add_to_page = true;
          var html_history = '';
          var html_schedule = '';
          $.each(data.BookingsList, function(index, elem){
            var start_date = eval("new " + elem.StartDate.slice(1, -1));
            var moment_date = moment(start_date);
            var current_date = moment(new Date());
            if(moment_date > current_date) {
              if(is_first_add_to_page){
                $(".ntermin .date-post").text(moment_date.format('l'));//data
                $(".ntermin .time-hr").text(moment_date.format('hh:mm'));//ora
                $(".ntermin .behandlung").text(elem.ServiceName);//medic
                is_first_add_to_page = false;
              }
              html_history += '<div class="alert alert-warning" role="alert">';
              //html_history += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
              html_history += '<img src="img/tic.png" alt="Tooth-Icon" class="notification-icon" />';
              html_history += '<table class="notification-text">';
              html_history += '<tr>';
              html_history += '<td class="op">Datum:</td>';
              html_history += '<td class="opval">' + moment_date.format('l') + '</td>';
              html_history += '</tr>';
              html_history += '<tr>';
              html_history += '<td class="op">Uhr:</td>';
              html_history += '<td class="opval">' + moment_date.format('hh:mm') + '</td>';
              html_history += '</tr>';
              html_history += '<tr>';
              html_history += '<td class="op">Hausarzt:</td>';
              html_history += '<td class="opval">' + elem.ServiceName + '</td>';
              html_history += '</tr>';
              html_history += '</table>';
              html_history += '</div>';


              //for schedule below here
              var selected_date = moment(localStorage.selectedDate);
              if(selected_date.format('DD/MM/YYYY') == moment_date.format('DD/MM/YYYY')){
                var service_start_date = moment(eval("new " + elem.StartDate.slice(1, -1)));
                var service_end_date = moment(eval("new " + elem.EndDate.slice(1, -1)));
                console.log(service_start_date, service_end_date);
                $.each($('.my_schedule_hour'), function(index, schedule){
                  var schedule_start_date = moment(eval("new " + $(schedule).attr('data-time').slice(1, -1)));
                  var schedule_duration = $(schedule).attr('data-duration');
                  var schedule_end_date = schedule_start_date.clone().add(schedule_duration,'minutes');

                  if(schedule_start_date.isBefore(service_end_date) && service_start_date.isBefore(schedule_end_date)){
                    $(this).addClass('disabled');
                  }
                });
              }
              //end for schedule
            }
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
            var logo_link = '';
            if(elem.Logo == ""){
              logo_link = 'http://medserv.duk-tech.com/CmsData/no_image.jpg';
            }else{
              logo_link = 'http://medserv.duk-tech.com/CmsData/Domains/'+elem.Id+'/Logo/'+elem.Logo;
            }

            html += '<div class="col-xs-6 "><button class="btn-default btn-choice provider_categ_btn" data-id="'+elem.Id+'" onclick="helper.open_ntermin3page('+elem.Id+');"><img src="'+logo_link+'">'+elem.DefaultName+'</button></div>';
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
            html += '<button class="btn-ghost btn-l" onclick="service.GetServicesByCategory('+elem.Id+',\'' + elem.Name + '\');">'+elem.Name+'</button>';
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
  GetServicesByCategory: function(Id, name){
    localStorage.serviceCategoryName = name;
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
  },
  GetNewScheduleBookingScreen: function () {

    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetNewScheduleBookingScreen',
      type: 'POST',
      data: JSON.stringify({
        Token: localStorage.userToken,
        serviceId: localStorage.current_service_id,
        resourceIds: ''
      }),
      contentType: 'application/json',
      success: function (data) {
        console.log('GetNewScheduleBookingScreen', data);
        if (data.Status == 1) {
          var resources = [];
          var active_days = data.BookingScreen.WeeklySchedule;
          var service_duration = data.BookingScreen.Service.Duration;
          $.each(data.BookingScreen.Resources, function(index, elem){
            var res = {id: elem.Id, type: elem.ResourceTypeId};
            resources.push(res);
          });
          var groupBy = function(myarray, key) {
            return myarray.reduce(function(rv, x) {
              (rv[x[key]] = rv[x[key]] || []).push(x);
              return rv;
            }, {});
          };
          var res_final = groupBy(resources, 'type');
          var resources_string = '';
          var i = 0;
          $.each(res_final, function (index, elem) {
            i++;
            $.each(elem, function (ind, e) {
              resources_string += e.id;
              if((ind +1 ) == elem.length && i < Object.keys(res_final).length){
                resources_string += '-';
              }else if((ind +1 ) < elem.length){
                resources_string += ',';
              }
            });
          });
          localStorage.serviceResources = resources_string;
          $(".responsive-calendar").responsiveCalendar({
            monthChangeAnimation: false,
            onDayClick: function (events) {
              if($(this).parent().hasClass('active')){
                var postdate = $(this).attr("data-month") + "/" + $(this).attr("data-day") + "/" + $(this).attr("data-year");
                service.GetDailyScheduleForClientBooking_V2(postdate, service_duration);
              }else{
                navigator.notification.alert(
                  'Please select only active days!',  // message
                  function(){},         // callback
                  'Warning',            // title
                  'Ok'                  // buttonName
                );
              }
            },
            onMonthChange: function(){
              helper.set_calendar_active_days(active_days);
            }

          });
          helper.set_calendar_active_days(active_days);
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
  GetDailyScheduleForClientBooking_V2: function(date, service_duration){
    if(!date){
      return;
    }
    if(!service_duration){
      service_duration = 30;
    }
    localStorage.service_duration = service_duration;
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/GetDailyScheduleForClientBooking_V2',
      type: 'GET',
      data: {
        Token: localStorage.userToken,
        serviceId: localStorage.current_service_id,
        resourcesFormat: localStorage.serviceResources,
        selectedDate: date,
        bookingDuration : service_duration,
        bookingId: 0
      },
      success: function (data) {
        console.log('GetDailyScheduleForClientBooking_V2',data);
        if (data.Status == 1) {
          if(data.DailySchedule.length > 0){
            localStorage.selectedDate = date;
            localStorage.dailySchedule = JSON.stringify(data.DailySchedule);
          }else{
            navigator.notification.alert(
              'You can not book this day. Please select another date!',  // message
              function(){},         // callback
              'Warning',            // title
              'Ok'                  // buttonName
            );
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
  },
  CustomerBookingRequestMobile: function () {

    var userToken = localStorage.userToken;
    var current_service_id = localStorage.current_service_id;
    var selectedHour = localStorage.selectedHour;

    var date = eval("new " + selectedHour.slice(1, -1));
    var moment_date = moment(date).format('DD-MM-YYYY HH:mm');
    console.log(moment_date);
    $.ajax({
      url: 'http://medserv.duk-tech.com/WS/Service.svc/CustomerBookingRequestMobile',
      type: 'POST',
      data: JSON.stringify({
        Token: userToken,
        serviceId: current_service_id,
        bookingDate: moment_date,
        resourcesIds: []
      }),
      contentType: 'application/json',
      success: function (data) {
        console.log('CustomerBookingRequestMobile',data);
        if (data.Status == "1") { //if success
          window.open('success.html', '_self', 'location=yes');
        } else {
          navigator.notification.alert(
            data.Message,  // message
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
  }
};