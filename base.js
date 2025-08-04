



let Settings = JSON.parse(localStorage.getItem("Settings")) || {
  SaveOnServer: false,
  IntervalDays: 1
};

const oneDayInMs = 24 * 60 * 60 * 1000;

function DateToDays(fromDate = new Date(0), toDate = new Date()) {
    return Math.floor((toDate - fromDate) / oneDayInMs);
}

function TimeToSeconds(date = new Date()) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return (hours * 3600) + (minutes * 60) + seconds;
}



class My_Local_Datas {
    constructor(){
        this.Tasks=JSON.parse(localStorage.getItem("LocalTasksDatas")) || [];
    }
    SaveDatas(){
        localStorage.setItem('LocalTasksDatas', JSON.stringify(this.Tasks));
    }
}

let m_db = new My_Local_Datas();

// Create , Read, Edit, Remove
// Title, Description Info, Image, Time, Date, Check Point, Alarm, 

class TaskToDo {
    constructor(){
        this.checked=false;
        this.title="title";
        this.description="info";
        this.started_time=TimeToSeconds();
        this.started_date=DateToDays();
        this.auto_remove_time=0;
        this.auto_remove_date=this.started_date+Settings.IntervalDays;

        // load or create list

    }
}


class ToDoList {
    constructor(){
        this.Tasks=m_db.Tasks;
        // load or create list
    }
    ShowTasks(){

    }
}

let MyList = new ToDoList();


function OnClickId(id, callback){
    document.getElementById(id).addEventListener('click', callback);
}

function ChangeSettingDisplay(b){
    document.getElementById('SettingPage').style.display = b?'block':'none';
}

window.addEventListener('DOMContentLoaded', () => {
    OnClickId("Setting", () => {
        ChangeSettingDisplay(true);
    });
    OnClickId("SaveSettings", () => {
        ChangeSettingDisplay(false);
    });
    OnClickId("CancelSettings", () => {
        ChangeSettingDisplay(false);
    });


    OnClickId("NewTaskButton", () => {
        MyList.Tasks.push(new TaskToDo());
    });
});



