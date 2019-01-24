var tasks=[];
var completedTasks=[];

function Task(name, category, time){
    this.check=false;
    this.name=name;
    this.category=category;
    this.time=time;
}

var checked=[];
var unchecked=[];

function updateTables(){
    for (var i=0; i<tasks.length; i++){
        if (tasks[i].check===true){
            checked.push(tasks[i]);
        }else{
            unchecked.push(tasks[i]);
        }
    }

    for (var x=0; x<completedTasks.length; x++){
        if (completedTasks[x].check===false){
            unchecked.push(completedTasks[x]);
        }else{
            checked.push(completedTasks[x]);
        }
    }

    tasks=[];
    completedTasks=[];

    for (var y=0; y<unchecked.length; y++){
        tasks.push(unchecked[y]);
    }
    for (var z=0; z<checked.length; z++){
        completedTasks.push(checked[z]);
    }

    resetTables();

    listTasks("", tasks);

    checked=[];
    unchecked=[];
}

function checkTasks(index) {
    tasks[index].check = !tasks[index].check;
    /*if (tasks[index].check === false) {
        tasks[index].check = true;
    } else {
        tasks[index].check = false;
    }*/
    //console.log(tasks[index].check);
}

function checkCompletedTasks(index){
    completedTasks[index].check=!completedTasks[index].check;
    /*if (completedTasks[index].check===true){
        completedTasks[index].check=false;
    }else{
        completedTasks[index].check=true;
    }*/
    //console.log(completedTasks[index].check);
}

function listTasks(date, newTasks, isItNew){
  if(date.length>0){
    $("#toDoDay").html("For " + date + "<br>");
  }
    tasks = newTasks;
    //unchecked = newTasks;
    if(isItNew){completedTasks = [];}
    //checked = [];
    resetTables();
    var timeLeft = 0;
    for (var i=0;i<tasks.length;i++){
        $('table#toDo').append("<tr>" +
            "<td><input class='checkbox' type='checkbox' onclick='checkTasks(" + i + ")'></td>" +
            "<td>" +tasks[i].name+ "</td>" +
            "<td>" +tasks[i].category+ "</td>" +
            "<td>" +tasks[i].time+ "</td>" +
            "</tr>"
        );
        timeLeft+=tasks[i].time;
    }
    $("#timeLeft").html(timeLeft);
    for (var x=0;x<completedTasks.length;x++){
        $('table#completed').append("<tr>" +
            "<td><input class='checkbox' type='checkbox' onclick='checkCompletedTasks(" + x + ")' checked></td>" +
            "<td>" +completedTasks[x].name+ "</td>" +
            "<td>" +completedTasks[x].category+ "</td>" +
            "<td>" +completedTasks[x].time+ "</td>" +
            "</tr>"
        )
    }
}

function resetTables(){
    $('table#toDo').html("<tr>" +
        "<th></th>" +
        "<th>Task:</th>" +
        "<th>Category:</th>" +
        "<th>Time:</th>" +
        "</tr>");

    $('table#completed').html("<tr>" +
        "<th></th>" +
        "<th>Task:</th>" +
        "<th>Category:</th>" +
        "<th>Time:</th>" +
        "</tr>");
}

/*window.onload= function(){
    tasks.push(new Task("Clean UR ROom", "Chores", "1 hour"));
    tasks.push(new Task("walk the doggo:)", "Chores", "2 hours"));
    tasks.push(new Task("eat sum fruits", "Health", "7 min"));
    tasks.push(new Task("get into COLLEGE", "School", "16392 hours"));
    listTasks();
};*/
