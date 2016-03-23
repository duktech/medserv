var helper = {
	get_current_user: function(){
		if(localStorage.userToken){
			return localStorage.userToken;
		}
		return false;
	}
}
var service = {
	user_login: function(email, pswd){
		$.ajax({
			url: 'http://boookme.duk-tech.com/WS/Service.svc/Login',
			type: 'POST',
			data: JSON.stringify({
				username: email,
				password: pswd
			}),
			contentType: 'application/json',
			success: function(data){
				if(data.AuthenticationResult.AuthStatus == "1"){ //if success
					localStorage.userToken = data.AuthenticationResult.Token;
					window.open('ntermin.html', '_self', 'location=yes');
				}else{
					alert(data.AuthenticationResult.Message);
				}
			},
			error: function(err) {
				alert('Error');
			}
		});
	},
	get_bookings_for_user(token){
		if(!token){
			token = localStorage.userToken;
		}
		$.ajax({
			url: 'http://boookme.duk-tech.com/WS/Service.svc/GetFullCallendarBookingsCustomer',
			type: 'GET',
			data: {Token: token,},
			success: function(data){
				if(data.Status == 1){
					console.log(data);
					
					var start_date = eval("new " + data.BookingsList[0].StartDate.slice(1, -1))
					console.log(start_date);
					var moment_date = moment(start_date);
					
					$(".date-post").text(moment_date.format('mm.d.YYYY'));//data
					$(".time-hr").text(moment_date.format('hh:mm'));//ora
					$(".behandlung").text(data.BookingsList[0].ServiceName);//medic
				}
				
			},
			error: function(err) {
				alert('Error');
			}
		});
	}
}