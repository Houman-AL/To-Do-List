
let temp_task;

let Settings = JSON.parse(localStorage.getItem("Settings")) || {
  SaveOnServer: false,
  IntervalDays: 1
};

if (typeof Settings.IntervalDays !== 'number' || Settings.IntervalDays < 0 || Settings.IntervalDays > 1000000 || !Number.isInteger(Settings.IntervalDays)) Settings.IntervalDays=1;

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

class TaskToDo {
    constructor(){
        this.checked=false;
        this.title="";
        this.description="";
        this.started_time=TimeToSeconds();
        this.started_date=DateToDays();
        this.auto_remove_time=0;
        this.auto_remove_date=this.started_date+Settings.IntervalDays;
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
                temp_task = this.Tasks[id];
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
            checkbox.checked = task.checked;

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
    }
}

let MyList = new ToDoList();

function SaveSettings(){
    localStorage.setItem('Settings', JSON.stringify(Settings));
}

function OnClickId(id, callback){
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('click', callback);
    }
}

function ChangeSettingDisplay(b){
    document.getElementById('SettingPage').style.display = b?'block':'none';
}

function ChangeEditorDisplay(b){
    document.getElementById('TaskEditor').style.display = b?'block':'none';
}

function SaveNewTask(){
    const task = LoadEditorValues();
    if (temp_task && MyList.Tasks.includes(temp_task)) {
        const index = MyList.Tasks.indexOf(temp_task);
        MyList.Tasks[index] = task;
    } else {
        MyList.Tasks.push(task);
    }
    MyList.SaveTasks();
    MyList.ShowTasks();
    ChangeEditorDisplay(false);
}

function CloseTaskEditor(){
    ChangeEditorDisplay(false);
}

window.addEventListener('DOMContentLoaded', () => {
    const NewTaskInput = document.getElementById("NewTaskInput");
    
    OnClickId("Setting", () => {
        document.getElementById('DefaultInterval').value=Settings.IntervalDays;
        ChangeSettingDisplay(true);
    });
    OnClickId("SaveSettings", () => {
        let backup=Settings.IntervalDays;
        Settings.IntervalDays = parseInt(document.getElementById('DefaultInterval').value);
        if (Settings.IntervalDays < 0 || Settings.IntervalDays > 1000000) Settings.IntervalDays=backup;
        SaveSettings();
        ChangeSettingDisplay(false);
    });
    OnClickId("CancelSettings", () => {
        ChangeSettingDisplay(false);
    });

    OnClickId("NewTaskButton", () => {
        if (NewTaskInput) {
            temp_task = new TaskToDo();
            temp_task.title = NewTaskInput.value;
            NewTaskInput.value="";
            LoadValuesToEditor(temp_task);
            ChangeEditorDisplay(true);
        }
    });

    OnClickId("SaveTask", SaveNewTask);
    OnClickId("CancelTask", CloseTaskEditor);

    MyList.ShowTasks();
});