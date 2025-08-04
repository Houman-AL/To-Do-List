

async function SendDatas(tb){
    try {
      const response = await fetch('http://5.42.223.149:18080/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tb: tb,
          timestamp: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Server response:', result);
      return result;
    } catch (error) {
      console.error('Error sending tasks:', error);
      throw error;
    }
}



let temp_task;


let Settings = JSON.parse(localStorage.getItem("Settings")) || {
  SaveOnServer: false,
  IntervalDays: 1
};

if (typeof Settings.IntervalDays !== 'number' || Settings.IntervalDays < 0 || !Number.isInteger(Settings.IntervalDays)) Settings.IntervalDays=1;

const oneDayInMs = 24 * 60 * 60 * 1000;

function DateToDays(fromDate = new Date(0), toDate = new Date()) {
    return Math.floor((toDate - fromDate) / oneDayInMs);
}

function TimeToSeconds(date = new Date()) {
  if (!(date instanceof Date)) {
    console.warn('ورودی باید شیء Date باشد.');
    date = new Date(date);
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return (hours * 3600) + (minutes * 60) + seconds;
}

function TimeToSecondsFromHMS(h, m, s) {
  return h * 3600 + m * 60 + s;
}

function DaysToDate(days, fromDate = new Date(0)) {
    const result = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
    return result;
}

function SecondsToTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    return `${h}:${m}`;
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



function LoadEditorValues() {
    const task = new TaskToDo();

    task.title = document.getElementById("Title").value.trim();
    task.description = document.getElementById("Description").value.trim();

    const startedDateStr = document.getElementById("Started_Date_Input").value;
    const startedTimeStr = document.getElementById("Started_Time_Input").value;
    const autoRemoveDateStr = document.getElementById("Auto_Remove_Date_Input").value;
    const autoRemoveTimeStr = document.getElementById("Auto_Remove_Time_Input").value;


    if (startedDateStr) task.started_date = DateToDays(new Date(startedDateStr));

    if (startedTimeStr) {
        const [h, m] = startedTimeStr.split(":").map(Number);
        task.started_time = TimeToSecondsFromHMS(h, m, 0);
    }

    if (autoRemoveDateStr) task.auto_remove_date = DateToDays(new Date(autoRemoveDateStr));

    if (autoRemoveTimeStr) {
        const [h, m] = autoRemoveTimeStr.split(":").map(Number);
        task.auto_remove_time = TimeToSecondsFromHMS(h, m, 0);
    }

    task.checked = document.getElementById("checked").checked;

    return task;
}

function LoadValuesToEditor(task) {
    document.getElementById("Title").value = task.title || "";
    document.getElementById("Description").value = task.description || "";

    if (task.started_date !== undefined) {
        const startedDate = DaysToDate(task.started_date);
        document.getElementById("Started_Date_Input").value = startedDate.toISOString().split("T")[0];
    }

    if (task.started_time !== undefined) {
        document.getElementById("Started_Time_Input").value = SecondsToTime(task.started_time);
    }

    if (task.auto_remove_date !== undefined) {
        const removeDate = DaysToDate(task.auto_remove_date);
        document.getElementById("Auto_Remove_Date_Input").value = removeDate.toISOString().split("T")[0];
    }

    if (task.auto_remove_time !== undefined) {
        document.getElementById("Auto_Remove_Time_Input").value = SecondsToTime(task.auto_remove_time);
    }

    document.getElementById("checked").checked = !!task.checked;
}




// Create , Read, Edit, Remove
// Title, Description Info, Image, Time, Date, Check Point, Alarm, 

class TaskToDo {
    constructor(){
        this.checked=false;
        this.title="";
        this.description="";
        this.started_time=TimeToSeconds();
        this.started_date=DateToDays();
        this.auto_remove_time=0;
        this.auto_remove_date=this.started_date+Settings.IntervalDays;

        // load or create list

    }

    dump() {
        return {
            checked: this.checked,
            title: this.title,
            description: this.description,
            started_time: this.started_time,
            started_date: this.started_date,
            auto_remove_time: this.auto_remove_time,
            auto_remove_date: this.auto_remove_date
        };
    }

    load(data) {
        this.checked = !!data.checked;
        this.title = data.title || "";
        this.description = data.description || "";
        this.started_time = Number(data.started_time) || 0;
        this.started_date = Number(data.started_date) || 0;
        this.auto_remove_time = Number(data.auto_remove_time) || 0;
        this.auto_remove_date = Number(data.auto_remove_date) || this.started_date + Settings.IntervalDays;
    }
}

class ToDoList {
    constructor(){
        this.Tasks=m_db.Tasks;
        // load or create list
    }

    SaveTasks(){
        m_db.Tasks=this.Tasks;
        m_db.SaveDatas();
    }
    HaveIdFromTasks(id){
        if (typeof id !== 'number' || id < 0 || !Number.isInteger(id)) {
            console.error('Invalid task ID - must be a positive integer');
            return false;
        }
        if (!Array.isArray(this.Tasks)){
            console.warn(`Its Not Array`);
            return false;
        }
        if(!this.Tasks[id]) {
            console.warn(`Task with ID ${id} not found`);
            return false;
        }
        return true;
    }
    OpenTaskEditor(id){
        if (!this.HaveIdFromTasks(id)) return false;
        try {
            if (this.Tasks && this.Tasks[id]){
                LoadValuesToEditor(this.Tasks[id]);
                ChangeEditorDisplay(true);
            }
        } catch (error) {
            console.error('Failed to open task editor:', error);
            return false;
        }
    }
    RemoveTask(id){
        if (!this.HaveIdFromTasks(id)) return false;
        this.Tasks.splice(id, 1);
        this.SaveTasks();
        this.ShowTasks();
    }
    ShowTasks(){

        const task_list_div = document.getElementById("TaskList");
        if (!task_list_div) return;

        task_list_div.innerHTML = '';

        let n=0;
        this.Tasks.forEach(task => {
            let id = n;
            const taskDiv = document.createElement('div');
            taskDiv.className = 'TaskItem';
            taskDiv.setAttribute('data-id', id);

            const spanTitle = document.createElement('span');
            spanTitle.className = 'TaskTitle';
            spanTitle.innerHTML = `
                ${task.title}
            `;

            const checkbox = document.createElement('input');
            checkbox.className = 'TaskCheckBox';
            checkbox.name = 'TaskCheckBox';
            checkbox.type = 'checkbox';

            const infoButton = document.createElement('button');
            infoButton.className = 'TaskInfoButton';
            infoButton.textContent = 'Info/Edit';
            infoButton.onclick = () => {this.OpenTaskEditor(id)};

            const removeButton = document.createElement('button');
            removeButton.className = 'RemoveTaskButton';
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => {this.RemoveTask(id)};

            n++;

            taskDiv.appendChild(spanTitle);
            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(infoButton);
            taskDiv.appendChild(removeButton);

            task_list_div.appendChild(taskDiv);

        });


    // LoadValuesToEditor();
    }
}

let MyList = new ToDoList();


function OnClickId(id, callback){
    document.getElementById(id).addEventListener('click', callback);
}

function ChangeSettingDisplay(b){
    document.getElementById('SettingPage').style.display = b?'block':'none';
}

function ChangeEditorDisplay(b){
    document.getElementById('TaskEditor').style.display = b?'block':'none';
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
        temp_task = new TaskToDo();
        temp_task.title = NewTaskInput.value;
        LoadValuesToEditor(temp_task);
        ChangeEditorDisplay(true);
    });

    MyList.ShowTasks();
});

function SaveNewTask(){
    MyList.Tasks.push(LoadEditorValues());
    MyList.ShowTasks();

    ChangeEditorDisplay(false);

}

function CloseTaskEditor(){
    ChangeEditorDisplay(false);
    MyList.ShowTasks();
}

        // MyList.Tasks.push(new TaskToDo());
        // LoadValuesToEditor(MyList.Tasks[MyList.Tasks.length-1]);



