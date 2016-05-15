$("#Message_Row").hide();

//For getting CSRF token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var server_send_get_response = function (text, step, method) {
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url : window.location.href,
        type : "POST",
        data : {
            csrfmiddlewaretoken : csrftoken,
            text: text,
            step: step,
            method: method
        },

        success : function(json) {
            $("#end_text_textarea").val(json['crypted_text']);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            document.write(xhr.status + ": " + xhr.responseText);
        }
    });
};

$("#encrypt_btn").click(function(e) {
    e.preventDefault();
    var start_text = $('#start_text_textarea').val();
    var method = 'encrypt';
    var step = $('#crypt_step').val()%26;
    server_send_get_response(start_text, step, method);
});


$("#decrypt_btn").click(function (e) {
    e.preventDefault();
    var start_text = $('#start_text_textarea').val();
    var method = 'decrypt';
    var step = $('#crypt_step').val()%26;
    server_send_get_response(start_text, step, method);
});

var letters = [];
var labels = [];



var Letters_to_zero = function () {
    for (var i=65; i<91; i++)
    {
        var index = i - 65;
        letters[index] = 0;
        labels[index] = String.fromCharCode(i);
    }
};

Letters_to_zero();


var ctx = $("#Letters_chart").get(0).getContext("2d");
var data = {
    labels: labels,
    datasets: [
        {
            label:"Count of symbols",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: letters
        }
    ]
};
var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }
});


$("#start_text_textarea").keyup(function () {
    Letters_to_zero();
    var upCaseString = $("#start_text_textarea").val().toUpperCase();
    for (var i=0; i<upCaseString.length; i++)
    {
        letters[upCaseString.charCodeAt(i)-65] += 1;
        myBarChart.data.datasets.data = letters;
    }
    if (upCaseString.length <= 100) {
    } else {
        kek = [1, 2, 4];
        var maxLetterCount = 0, maxLetterIndex = -1;
        for (var j = 0; j < letters.length; j++) {
            if (letters[j] > maxLetterCount) {
                maxLetterCount = letters[j];
                maxLetterIndex = j;
            }
        }
        var step = maxLetterIndex - 4;
        if (step != 0) {
            $("#MessageText").text("Скорее всего, введенный вами текст был зашифрован с шагом " + step);
            $("#Message_Row").show();
        }
        else {
            $("#Message_Row").hide();
        }
    }
    myBarChart.update();
});