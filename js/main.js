$(document).ready(function(){
  helper.updateUserToUi();
});
var serviceBaseUrl = 'http://192.168.0.94/boookmeWS/Service.svc/';//http://medserv.duk-tech.com/WS/Service.svc/
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
  updateUserToUi: function(){
    var userToken = localStorage.userToken;
    var userInfo = localStorage.userInfo;
    if(userInfo){
      userInfo = JSON.parse(userInfo);
      $('.avatar-name').text(userInfo.Firstname + " " + userInfo.Lastname);
      $('.mpname').text(userInfo.Firstname + " " + userInfo.Lastname)
      if(userInfo.PhoneNumber){
        $('.userPhone').text(userInfo.PhoneNumber);
      }
      if(userInfo.Email){
        $('.userEmail').text(userInfo.Email);
      }
      if(userInfo.Address){
        $('.userAddress').text(userInfo.Address);
      }

    }else{
      $('.navmenu-brand').hide();

    }
  },
  open_ntermin3page: function(categ_id, category_name){
    localStorage.provider_category_id = categ_id;
    localStorage.provider_category_name = category_name;
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
  go_to_calendar: function(){

    if(localStorage.current_service_id){
      if($('#other_service_id').length>0){
        var desc = $('#other_service_id').val();
        if(desc != '') {
          localStorage.current_service_description = desc;
          window.open('calendar.html', '_self', 'location=yes');
        }else{
          navigator.notification.alert(
            'Please add service description!',  // message
            function(){},         // callback
            'Warning',            // title
            'Ok'                  // buttonName
          );
        }
      }else {
        window.open('calendar.html', '_self', 'location=yes');
      }
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
        'Please select an active date!',  // message
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
      var isFreeText = 'nicht frei';
      if(elem.IsAvailable){
        cclass = 'ava';
        disabled = '';
        isFreeText = 'frei';
      }
      var start_date = eval("new " + elem.Time.slice(1, -1));
      var moment_date = moment(start_date);

      html += '<td class="cnone '+disabled+'"><a href="#" class="time-hr" data-time="'+elem.Time+'" data-duration="'+service_duration+'">'+elem.TimeToString+'</a></td>';
      html += '<td class="'+cclass+'">';
      html += isFreeText;
      html +=  '</td>';
      html += '<td class="my_schedule_hour '+disabled+'" data-time="'+elem.Time+'" data-duration="'+service_duration+'">';
      if(elem.IsAvailable) {
        html += 'Select'
      }
      html +=  '</td>';
      html += '</tr>';
    });
    $('.schedule-tab').append(html);
    //$('.schedule-tab td.cnone').click(function(){
    //  if($(this).hasClass('disabled')){
    //    return 0;
    //  }
    //  $('.schedule-tab .cnone').removeClass('active');
    //  $(this).addClass('active');
    //  localStorage.selectedHour = $(this).find('a').attr('data-time');
    //});
    $('.schedule-tab td.my_schedule_hour').click(function(){
      if($(this).hasClass('disabled')){
        return 0;
      }
      $('.schedule-tab .cnone').removeClass('active');
      $('.schedule-tab tr').removeClass('selected');
      $(this).parent().find('.cnone').addClass('active');
      $(this).parent().addClass('selected');
      localStorage.selectedHour = $(this).attr('data-time');
    });
  },
  getUserPrefProvider: function(){

    var html = '';
    var prefArtze = localStorage.prefArtze;
    if(prefArtze) {
      prefArtze = JSON.parse(prefArtze);
      $.each(prefArtze, function(index, elem){

        var logo_link = '';
        if(elem.provider.Logo == "" || !elem.provider.Logo_mobile){
          logo_link = 'http://medserv.duk-tech.com/CmsData/no_image.jpg';
        }else{
          logo_link = 'http://medserv.duk-tech.com/CmsData/Provider/'+elem.provider.Id+'/Logo/'+elem.provider.Logo_mobile;
        }
        html += '<tr>';
        html += '<td onclick="helper.open_ntermin3page('+elem.category.Id+',\''+ elem.category.DefaultName +'\' );">';
        html += '<div class="col-xs-3"> <img src="'+logo_link+'" class="categ_img img-responsive"/> </div>';
        html += '<div class="col-xs-7 categ_title"> <span>' + elem.category.DefaultName + '</span> <p>pref: '+elem.provider.Name+'</p></div>';
        html += '<div class="col-xs-2 pull-right"><button type="button" class="btn-tethr changePrefProvider" onclick="helper.open_artze3page('+elem.category.Id+');"><i class="glyphicon glyphicon-edit"></i></button></div>';
        html += '</td>';
        html += '</tr>';

      });
    }else{
      html = '<tr><td><h2 class="text-center">No prefered providers selected</h2></td></tr>';
    }
    $('.prefered_container').append(html);
    $('button.changePrefProvider').click(function(e){
      e.stopPropagation();
    });

  },
  open_artze3page: function(categ_id, with_redirect){
    console.log(with_redirect);
    if(with_redirect){
      localStorage.artze3redirect = true;
    }
    localStorage.arzte_pref_category_id = categ_id;
    window.open('mein-arzte-step3.html', '_self', 'location=yes');
  },
  open_ntermin3step2: function(serviceCategoryId, serviceCategoryName){
    localStorage.serviceCategoryId = serviceCategoryId;
    localStorage.serviceCategoryName = serviceCategoryName;
    window.open('ntermin3-step2.html', '_self', 'location=yes');
  },
  savePrefProvider: function(category_id, provider_id, with_redirect){
    console.log(category_id, provider_id);
    var allCategoriesForArtze = JSON.parse( localStorage.allCategoriesForArtze );
    var providerForCurrentCategoryArtze = JSON.parse( localStorage.providerForCurrentCategoryArtze );
    var current_category = null;
    var current_provider = null;

    $.each(allCategoriesForArtze, function(index, elem){
      if(elem.Id == category_id){
        current_category = elem;
      }
    });
    $.each(providerForCurrentCategoryArtze, function(index, elem){
      if(elem.Id == provider_id){
        current_provider = elem;
      }
    });


    if(current_category && current_provider){
      var prefArtze = localStorage.prefArtze;
      var pref_obj = {category: current_category, provider: current_provider};
      if(prefArtze){
        prefArtze = JSON.parse(prefArtze);
        console.log(prefArtze);
        prefArtze = $.grep(prefArtze, function (el, i) {
          if(el.category.Id == current_category.Id){
            return false;
          }
          return true; // keep the element in the array
        });
        prefArtze.push(pref_obj);
        localStorage.prefArtze = JSON.stringify(prefArtze);
      }else{
        prefArtze = [];
        prefArtze.push(pref_obj);
        localStorage.prefArtze = JSON.stringify(prefArtze);
      }
    }

    if(with_redirect){
      console.log(current_category, current_provider);

      helper.open_ntermin3page(current_category.Id,current_category.DefaultName );
    }else{
      window.open('mein-arzte.html', '_self', 'location=yes');
    }

  },
  distanceBetweenCoords : function(lat1, lon1, lat2, lon2){
    if(lat1 == null || lon1 == null || lat2 == null || lon2 == null){
      return -1;
    }
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p))/2;

    //return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    return Math.round((12742 * Math.asin(Math.sqrt(a))) * 1000); // in meters
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
      url: serviceBaseUrl + 'RegisterUser',
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
      url: serviceBaseUrl + 'Login',
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
          service.saveCustomerProfileToLS(true);
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
  saveCustomerProfileToLS: function (withRedirect){
    var token = localStorage.userToken;
    $.ajax({
      url: serviceBaseUrl + 'GetCustomerProfile',
      type: 'GET',
      data: {Token: token},
      success: function (data) {
        if (data.Status == "1") {
          localStorage.userInfo = JSON.stringify(data.Customer);
        }
        if(withRedirect){
          window.open('ntermin.html', '_self', 'location=yes');
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
  get_bookings_for_user: function (token) {
    if (!token) {
      token = localStorage.userToken;
    }

    $.ajax({
      url: serviceBaseUrl + 'GetBookingsCustomerBetweenDates',//GetFullCallendarBookingsCustomer
      type: 'GET',
      data: {Token: token,
        startDate: moment(new Date()).format('l'),
        endDate: ''},
      success: function (data) {
        console.log(data);
        if (data.Status == 1) {

          data.DayBookings.sort(function(a,b){
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
          $.each(data.DayBookings, function(index, elem){
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

              var diffFromCurrentDate = moment.duration(moment_date.diff(current_date));
              var diffFromCurrentDateMinutes = diffFromCurrentDate.asMinutes();

              html_history += '<div class="alert alert-warning" role="alert" data-bookingId="'+elem.BookingId+'">';

              html_history += '<div class="col-xs-3">';
              html_history += '<img src="img/tic.png" alt="Tooth-Icon" class="notification-icon img-responsive" />';
              html_history += '</div>';

              html_history += '<div class="col-xs-7">';
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
              if(diffFromCurrentDateMinutes < 30 && !elem.CheckedIn) {

                html_history += '<div class="col-xs-2">';
                html_history += '<button type="button" class="btn-tethr checkin" onclick="service.checkIn('+elem.BookingId+',\''+elem.ProviderLatitude+'\',\''+elem.ProviderLongitude+'\')"><i class="glyphicon glyphicon-map-marker"></i></button>';
                html_history += '</div>';
              }

              html_history += '<div class="clearfix"></div>';
              html_history += '</div>';


              //for schedule below here, useless, deprecated
              //var selected_date = moment(localStorage.selectedDate);
              //if(selected_date.format('DD/MM/YYYY') == moment_date.format('DD/MM/YYYY')){
              //  var service_start_date = moment(eval("new " + elem.StartDate.slice(1, -1)));
              //  var service_end_date = moment(eval("new " + elem.EndDate.slice(1, -1)));
              //  //console.log(service_start_date, service_end_date);
              //  $.each($('.my_schedule_hour'), function(index, schedule){
              //    var schedule_start_date = moment(eval("new " + $(schedule).attr('data-time').slice(1, -1)));
              //    var schedule_duration = $(schedule).attr('data-duration');
              //    var schedule_end_date = schedule_start_date.clone().add(schedule_duration,'minutes');
              //
              //    if(schedule_start_date.isBefore(service_end_date) && service_start_date.isBefore(schedule_end_date)){
              //      $(this).addClass('disabled');
              //    }
              //  });
              //}
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
      url: serviceBaseUrl + 'GetAllCategories',
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

            //html += '<div class="col-xs-6 "><button class="btn-default btn-choice provider_categ_btn" data-id="'+elem.Id+'" onclick="helper.open_ntermin3page('+elem.Id+',\''+elem.DefaultName+'\');"><img src="'+logo_link+'">'+elem.DefaultName+'</button></div>';

            html += '<tr>';
            html += '<td data-id="'+elem.Id+'" onclick="helper.open_ntermin3page('+elem.Id+',\''+elem.DefaultName+'\');">';
            html += '<div class="col-xs-3"> <img src="'+logo_link+'" class="categ_img img-responsive"/> </div>';
            html += '<div class="col-xs-9 categ_title"> <span>' + elem.DefaultName + '</span> </div>';
            html += '</td>';
            html += '</tr>';
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
  getAllCategoriesArzte: function(){
    $.ajax({
      url: serviceBaseUrl + 'GetAllCategories',
      type: 'GET',
      success: function (data) {
        if (data.Status == 1) {
          localStorage.allCategoriesForArtze = JSON.stringify(data.SearchCategory);
          var html = '';
          var pref_category_id = localStorage.arzte_pref_category_id;
          var current_category = '';
          $.each(data.SearchCategory,function(index,elem){
            if (elem.Id == pref_category_id) {
              current_category = elem;
            }
            var logo_link = '';
            if(elem.Logo == ""){
              logo_link = 'http://medserv.duk-tech.com/CmsData/no_image.jpg';
            }else{
              logo_link = 'http://medserv.duk-tech.com/CmsData/Domains/'+elem.Id+'/Logo/'+elem.Logo;
            }
            html += '<tr>';
            html += '<td onclick="helper.open_artze3page('+elem.Id+');">';
            html += '<div class="col-xs-3"> <img src="'+logo_link+'" class="categ_img img-responsive"/> </div>';
            html += '<div class="col-xs-9 categ_title"> <span>' + elem.DefaultName + '</span> </div>';
            html += '</td>';
            html += '</tr>';

          });

          $('.categories_container').append(html);
          $('.for_artze_categ').text(' for ' + current_category.DefaultName);
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
  GetProviderForCategoryArzte: function(category_id){

    $('.addProviderContainer .provider').html('');
    $.ajax({
      url: serviceBaseUrl + 'GetProvidersForDomain',
      type: 'GET',
      data: {DomainId: category_id},
      success: function (data) {
        if (data.Status == 1) {
          localStorage.providerForCurrentCategoryArtze = JSON.stringify(data.ProviderList);
          var html = '';
          $.each(data.ProviderList,function(index,elem){
            var logo_link = '';
            if(elem.Logo_mobile == "" || !elem.Logo_mobile){
              logo_link = 'http://medserv.duk-tech.com/CmsData/no_image.jpg';
            }else{
              logo_link = 'http://medserv.duk-tech.com/CmsData/Provider/'+elem.Id+'/Logo/'+elem.Logo_mobile;
            }
            var artze3redirect = localStorage.artze3redirect;
            html += '<tr>';
            if(artze3redirect){
              html += '<td onclick="helper.savePrefProvider('+category_id+', '+elem.Id+', true)">';
            }else{
              html += '<td onclick="helper.savePrefProvider('+category_id+', '+elem.Id+')">';
            }
            html += '<div class="col-xs-3"> <img src="'+logo_link+'" class="categ_img img-responsive"/> </div>';
            html += '<div class="col-xs-9 categ_title"> <span>' + elem.Name + '</span> <p class="description">'+elem.Address+'</p></div>';
            html += '</td>';
            html += '</tr>';
          });
          if( data.ProviderList.length == 0 ){
            html = '<tr><td><h2 class="text-center">No providers for this category.</h2></td></tr>'
          }
          $('.providers_container').append(html);
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
    var provider_category_id = localStorage.provider_category_id;
    var prefArtze = localStorage.prefArtze;
    if(prefArtze){
      prefArtze = JSON.parse(prefArtze);
      var providerName = false;
      $.each(prefArtze,function(index,elem){
        if (elem.category.Id == provider_category_id){
          providerName = elem.provider.Name;
        }
      });
      if(!providerName){
        helper.open_artze3page(provider_category_id);
        //window.open('mein-arzte.html', '_self', 'location=yes');
      }
    }else{
      helper.open_artze3page(provider_category_id);
      //window.open('mein-arzte.html', '_self', 'location=yes');
    }
    $.ajax({
      url: serviceBaseUrl + 'GetProviderServiceCategories',
      type: 'GET',
      data: {name: providerName},
      success: function (data) {
        console.log('GetProviderServiceCategories',data);
        if (data.Status == 1) {
          if(data.ServiceCategoryList.length > 0) {
            var html = '';
            $.each(data.ServiceCategoryList, function (index, elem) {
              html += '<button class="btn-ghost btn-l newStyle" onclick="helper.open_ntermin3step2(' + elem.Id + ',\'' + elem.Name + '\')"><span class="pull-left">' + elem.Name + '</span> <icon class="glyphicon glyphicon-chevron-right pull-right"> </icon></button>';//service.GetServicesByCategory('+elem.Id+',\'' + elem.Name + '\');
            });
            $('.btn-list.service_categories').append(html);
          }else{
            $('.btn-list.service_categories').append('<h3>There are no services for this provider.</h3>');
            $('.go_to_artze').removeClass('hidden');
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
  GetServicesByCategory: function(Id){
    $.ajax({
      url: serviceBaseUrl + 'GetServicesByCategory',
      type: 'GET',
      data: {id: Id},
      success: function (data) {
        console.log('GetServicesByCategory',data);
        if (data.Status == 1) {
          var html = '';
          if(data.ServiceList.length > 1){//has services
            html = '';
            $.each(data.ServiceList, function(index, elem){
              html += '<button class="btn-ghost btn-l newStyle" onclick="helper.service_select('+elem.Id+',\'' + elem.Name + '\', true);"><span class="pull-left">' + elem.Name + '</span> <icon class="glyphicon glyphicon-chevron-right pull-right"> </icon></button>';
            });
            //modal-list
            $('.service_categories').append(html);

          }else{//no service
            helper.service_select(data.ServiceList[0].Id,data.ServiceList[0].Name);
            html = '';
            html += '<h3 class="text-center">'+data.ServiceList[0].Name+'</h3>';
            html += '<textarea rows="6" id="other_service_id" placeholder="Add service description"></textarea>';
            $('.service_categories').html(html);
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
      url: serviceBaseUrl + 'GetNewScheduleBookingScreen',
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
              localStorage.removeItem('selectedDate');
              $('.responsive-calendar .day a').removeClass('selected');
              if($(this).parent().hasClass('active')){
                $(this).addClass('selected');
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
      url: serviceBaseUrl + 'GetDailyScheduleForClientBooking_V2',
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
      url: serviceBaseUrl + 'CustomerBookingRequestMobile',
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
  },
  checkIn: function(bookingId, providerLat, providerLon){
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates

    var onSuccess = function(position) {
      console.log('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');

      var distance = helper.distanceBetweenCoords(position.coords.latitude, position.coords.longitude, providerLat.replace(',','.'), providerLon.replace(',','.'));

      if(distance < 50000){
        //call service
        var userToken = localStorage.userToken;
        $.ajax({
          url: serviceBaseUrl + 'ClientCheckIn',
          type: 'POST',
          data: JSON.stringify({
            Token: userToken,
            BookingId: bookingId
          }),
          contentType: 'application/json',
          success: function (data) {
            if(data.Status == "1"){
              $('.alert.alert-warning[data-bookingId="'+bookingId+'"] button.checkin').hide();
              navigator.notification.alert(
                'You successfully checked in. ',  // message
                function(){},         // callback
                'Success',            // title
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
      }else{
        alert('you are far');
      }
    };

    // onError Callback receives a PositionError object
    function onError(error) {
      navigator.notification.alert(
        'Error: '+error.message,  // message
        function(){},         // callback
        'Warning',            // title
        'Ok'                  // buttonName
      );
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
};