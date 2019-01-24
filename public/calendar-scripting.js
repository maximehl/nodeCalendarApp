var monthsDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
var monthContract = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
var eventTypes = ["Assignment", "Chore", "Class", "Practice", "Social", "Health"];
//we have a "activities" variable with the array of all activity objects

//tagHere have start date and end date for recurring events
var things = 0;/*[{eventText:"Walk the dog", weeklyRepeat: [2, 4], singleDates: ["day2018-10--1", "day2018-10--5", "day2018-10--27"], lengthEst:0.5, eventType:"Chore"},
    {eventText:"Watch the orchestra", weeklyRepeat: [], singleDates: ["day2018-10--4", "day2018-10--9"], lengthEst:3, eventType:"Social"},
    {eventText:"Cook dinner", weeklyRepeat: [6, 0], singleDates: [], lengthEst:2, eventType:"Health"},
    {eventText:"Advanced sword fighting", weeklyRepeat: [], singleDates: ["day2018-11--15", "day2019-0--15", "day2019-0--31"], lengthEst:6, eventType:"Class"},
    {eventText:"Write essays", weeklyRepeat:[1], singleDates:[], lengthEst:3, eventType:"Assignment"}];*/

//var things;

$(window).ready(function(){
    var date = new Date();
    var dayOfWeek = date.getDay(); //0 is Sunday, 1 is Monday... 6 is Saturday
    var dayOfMonth = date.getDate(); //August 19, 1998 will return 19

    var firstDayOfMonth = (dayOfMonth-dayOfWeek).mod(7);
    //determines whether first day of the month was a Sunday, Monday, etc.

    var username = $("[name='username']").val();
    //console.log("/getEvents?userID=" + username);
    $.get("/getEvents?userID=" + username, function(data, status){
      //console.log(data)
      things = data;
      //console.log(things);
      buildCalendar(firstDayOfMonth, date.getMonth(), date.getFullYear());
    });
    /*$.ajax({
        url: "/getEvents",
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        success: function(result){
            console.log(result);
            things = result;
            buildCalendar(firstDayOfMonth, date.getMonth(), date.getFullYear());
        },
        error: function(){
            alert('Failed!');
        }
    });*/
});

/*function updateAutoSelects(selector){
    $(selector).parent().toggleClass("dayAutoSelected");

    if($("[name='weekdayRepeat']:checked").length>0){
        $("#startEndDateInputs").css("display","block");
    }else{
        $("#startEndDateInputs").children().val("");
        $("#startEndDateInputs").css("display","none");
    }
}*/

function clearAllDates(){
    $("#selectedDates").children().remove();
    $("*").find(".daySelected").removeClass("daySelected");
    $("[name='weekdayRepeat']:checked").prop("checked", false);
    $("*").find(".dayAutoSelected").removeClass("dayAutoSelected");
}

function startSelectingDates(){
    $("#dateSelectMsg").html("Click days on the calendar to select or deselect them. Click outside the calendar to stop.");

    $("#selectedDates").children().each(function() {
        var selectObject = $("#" + $(this).data("datecode"));
        selectObject.addClass("daySelected");
        selectObject.parent().addClass("daySelected");
    });

    $("td").unbind("mousedown").on("mousedown", function(){
        //event.stopPropagation();
        if($(this).hasClass("daySelected")){
            $("#selectedDates").find("[data-datecode='" + $(this).find("div").attr("id") + "']").remove();
        }else{
            $("#selectedDates").append("<div data-datecode='" + $(this).find("div").attr("id") + "' class='spanDiv'>" +
                datify($(this).find("div").attr("id")) + ",&nbsp;</div>");
        }
        $(this).toggleClass("daySelected");
        $(this).find("div").toggleClass("daySelected");
        event.stopPropagation();
    });
    //.hover(function(){$(this).css("cursor", "pointer")});

    $("html").on("mousedown", function(){
        $("body").find(".daySelected").removeClass("daySelected");
        //.hover(function(){$(this).css("cursor", "default")});
        attachToDoEvents();
        $("#dateSelectMsg").html("");
        $(this).unbind("mousedown");
    });
}

function attachToDoEvents(){
    $("td").unbind("mousedown").on("mousedown", function(){
      var date = datify($(this).children().attr('id'));
        var taskArray = [];
        $(this).children().children().each(function(){
            taskArray.push(turnEventDivToObj($(this)));
        });
        listTasks(date, taskArray, true);
    });
}

function datify(idCode){
    var dashLoc = idCode.indexOf("--");
    var month = parseInt(idCode.substring(8, dashLoc));
    var day = parseInt(idCode.substring(dashLoc+2, idCode.length));
    var year = parseInt(idCode.substring(3, 7));
    return day + " " + monthContract[month] + " " + year;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function buildCalendar(firstDayOfMonth, month, year){
    var date = -1*firstDayOfMonth;
    var nextYear = 0;
    var prevYear = 0;
    if(month===11){
        nextYear = 1;
    }else if(month===0){
        prevYear = -1;
    }
    var code = "<table id='calendar'><tr><th colspan='7'><button id='b1' " +
        "onclick='buildCalendar(" + ((firstDayOfMonth-monthsDays[(month-1).mod(12)]).mod(7)) + ", " + (month-1).mod(12) + ", " + (year+prevYear) + ")' " +
        "style='float:left;'>← " + monthNames[(month-1).mod(12)] + "</button> " + monthNames[month] + " <button id='b2' onclick='" +
        "buildCalendar(" + ((firstDayOfMonth+monthsDays[month]).mod(7)/*-1*/) + ", " + (month+1).mod(12) + ", " + (year+nextYear) + ")' " +
        "style='float:right;'>" + monthNames[(month+1).mod(12)] + " →</button></th></tr>" +
        "<tr><th>Sunday</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th>" +
        "<th>Friday</th><th>Saturday</th></tr>";
    var tempDate;
    var monthInsert = "";
    var tempMonth;
    var tempYear;
    var numWeeks = 0;
    while(firstDayOfMonth+monthsDays[month]>numWeeks*7){
        numWeeks++;
    }
    for(var week=0; week<numWeeks; week++){
        code+="<tr>";
        for(var day = 0; day<7; day++){
            tempYear = year;
            if(date<0){
                tempMonth = (month-1).mod(12);
                tempDate=monthsDays[tempMonth]+date+1;
                if(tempMonth===11){
                    tempYear = year-1;
                }
            }else if(date>=monthsDays[month]){
                tempMonth = (month+1).mod(12);
                tempDate=date+1-monthsDays[month];
                if(tempMonth===0){
                    tempYear = year+1;
                }
            }else{
                tempMonth = month;
                tempDate=date+1;
            }
            if(tempDate===1){
                if(date===0){
                    monthInsert = monthContract[month] + " ";
                }else{
                    monthInsert = monthContract[(month+1).mod(12)] + " ";
                }
            }else{
                monthInsert = "";
            }
            code+="<td>" + monthInsert + tempDate + "<div id='day" +tempYear + "-" + tempMonth + "--" + tempDate + "' " +
                "class='weekday" + day + " calendarCell'></div></td>";
            date++;
        }
        code+="</tr>";
    }
    code += "</table>";
    $("#calendar").remove();
    $(code).appendTo("#calendarBox");

    $("[name='weekdayRepeat']:checked").each(function(){
        $(".weekday" + $(this).prop("value")).parent().addClass("dayAutoSelected");
    });

    generateEvents();
    attachToDoEvents();
}


//weeklyRepeat will be an array of weekday numbers: for example, if it repeats on Mondays, Wednesdays, and Fridays: [1, 3, 5]
//singleDate will be a number
function addEventToCalendar(obj){
    var eventText = obj.eventText;
    var weeklyRepeat = obj.weeklyRepeat;
    var singleDates = obj.singleDates;
    var lengthEst = obj.lengthEst;
    var eventType = obj.eventType;
    var cssSelector = "";
    var n;
    if(weeklyRepeat.length>0){
        for(n=0; n<weeklyRepeat.length; n++){
            cssSelector+=".weekday" + weeklyRepeat[n] + ", ";
        }
    }
    if(singleDates.length>0){
        for(n=0; n<singleDates.length; n++){
            cssSelector+="#" + singleDates[n] + ", ";
        }
    }
    cssSelector = cssSelector.slice(0, cssSelector.length-2); //there should always be a ", " at the end to remove
    // console.log(cssSelector.slice(cssSelector.length-2));
    // if(cssSelector.slice(cssSelector.length-2)===", "){
    //     cssSelector = cssSelector.slice(0, cssSelector.length-2);
    // }
    $(cssSelector).append("<div class='calendarEvent type" + eventType + "' data-lengthest='" + lengthEst + "'>" + eventText + "</div>");
}

function generateEvents(){
    for(var i = 0; i<things.length; i++){
        addEventToCalendar(things[i]);
    }

    /*for(var i = 0; i<activities.length; i++){
        addEventToCalendar(activities[i].eventText, activities[i].weeklyRepeat, activities[i].singleDates, activities[i].lengthEst);
    }*/
}

function turnEventDivToObj(eventObj){
    var returnObj = {};
    returnObj.name = eventObj.html();
    for(var i = 0; i<eventTypes.length; i++){
        if(eventObj.hasClass("type" + eventTypes[i])){
            returnObj.category = eventTypes[i];
            break;
        }
    }
    returnObj.time = eventObj.data("lengthest");
    returnObj.check = false;
    return returnObj;
}

function addNewEvent(){
    var eventObj = {};
    eventObj.eventText = $("[name='eventText']").val();
    $("[name='eventText']").val("");
    eventObj.weeklyRepeat = [];
    eventObj.singleDates = [];
    eventObj.lengthEst = $("[name='lengthEst']").val();
    $("[name='lengthEst']").val("");
    eventObj.eventType = $("[name='eventType']").val();
    $("[name='eventType']").val("Assignment");
    eventObj.userID = $("[name='username']").val();
    /*eventObj.weeklyRepeat[0] = 0; //tagHere startDate
    eventObj.weeklyRepeat[1] = 1; //tagHere endDate*/
    $("[name='weekdayRepeat']:checked").each(function(){
        eventObj.weeklyRepeat[eventObj.weeklyRepeat.length] = $(this).val();
    });
    $("#selectedDates").children().each(function(){
        eventObj.singleDates[eventObj.singleDates.length] = $(this).data("datecode");
    });
    clearAllDates();
    things[things.length] = eventObj;
    addEventToCalendar(eventObj);
    //return eventObj;
    $.post("/makeEvent", eventObj/*JSON.stringify(eventObj)*/, function(data, status){/*console.log(data + " " + status)*/})
    /*$.ajax({
      type: "POST",
      url: "/makeEvent",
      data: JSON.stringify(eventObj),
      success: function(result){
          console.log(result);
      },
      dataType: jsonp
    });*/
}

function checkVals(form){
  //var form = $("#eventForm");
  if(!form.eventText.value){
    Window.alert("Please name your event.");
    return false;
  }else if(!form.lengthEst.value){
    Window.alert("How long is your event? ");
    return false;
  }
  var dates = {};
  dates.weeklyRepeat = [];
  dates.singleDates = [];
  $("[name='weekdayRepeat']:checked").each(function(){
      dates.weeklyRepeat[dates.weeklyRepeat.length] = $(this).val();
  });
  $("#selectedDates").children().each(function(){
      dates.singleDates[dates.singleDates.length] = $(this).data("datecode");
  });
  if(!((dates.weeklyRepeat.length>0) || (dates.singleDates.length>0))){
    Window.alert("Include some dates for your event.");
    return false;
  }
  /*return */addNewEvent();
  return false;
}
