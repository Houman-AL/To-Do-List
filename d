[1mdiff --git a/base.js b/base.js[m
[1mindex 6f5cc6e..5ccfe71 100644[m
[1m--- a/base.js[m
[1m+++ b/base.js[m
[36m@@ -1,40 +1,12 @@[m
 [m
[31m-[m
[31m-async function SendDatas(tb){[m
[31m-    try {[m
[31m-      const response = await fetch('http://5.42.223.149:18080/', {[m
[31m-        method: 'POST',[m
[31m-        headers: {[m
[31m-          'Content-Type': 'application/json',[m
[31m-        },[m
[31m-        body: JSON.stringify({[m
[31m-          tb: tb,[m
[31m-          timestamp: new Date().toISOString()[m
[31m-        }),[m
[31m-      });[m
[31m-      if (!response.ok) {[m
[31m-        throw new Error(`HTTP error! status: ${response.status}`);[m
[31m-      }[m
[31m-      const result = await response.json();[m
[31m-      console.log('Server response:', result);[m
[31m-      return result;[m
[31m-    } catch (error) {[m
[31m-      console.error('Error sending tasks:', error);[m
[31m-      throw error;[m
[31m-    }[m
[31m-}[m
[31m-[m
[31m-[m
[31m-[m
 let temp_task;[m
 [m
[31m-[m
 let Settings = JSON.parse(localStorage.getItem("Settings")) || {[m
   SaveOnServer: false,[m
   IntervalDays: 1[m
 };[m
 [m
[31m-if (typeof Settings.IntervalDays !== 'number' || Settings.IntervalDays < 0 || !Number.isInteger(Settings.IntervalDays)) Settings.IntervalDays=1;[m
[32m+[m[32mif (typeof Settings.IntervalDays !== 'number' || Settings.IntervalDays < 0 || Settings.IntervalDays > 1000000 || !Number.isInteger(Settings.IntervalDays)) Settings.IntervalDays=1;[m
 [m
 const oneDayInMs = 24 * 60 * 60 * 1000;[m
 [m
[36m@@ -68,8 +40,6 @@[m [mfunction SecondsToTime(seconds) {[m
     return `${h}:${m}`;[m
 }[m
 [m
[31m-[m
[31m-[m
 class My_Local_Datas {[m
     constructor(){[m
         this.Tasks=JSON.parse(localStorage.getItem("LocalTasksDatas")) || [];[m
[36m@@ -81,8 +51,6 @@[m [mclass My_Local_Datas {[m
 [m
 let m_db = new My_Local_Datas();[m
 [m
[31m-[m
[31m-[m
 function LoadEditorValues() {[m
     const task = new TaskToDo();[m
 [m
[36m@@ -94,7 +62,6 @@[m [mfunction LoadEditorValues() {[m
     const autoRemoveDateStr = document.getElementById("Auto_Remove_Date_Input").value;[m
     const autoRemoveTimeStr = document.getElementById("Auto_Remove_Time_Input").value;[m
 [m
[31m-[m
     if (startedDateStr) task.started_date = DateToDays(new Date(startedDateStr));[m
 [m
     if (startedTimeStr) {[m
[36m@@ -139,12 +106,6 @@[m [mfunction LoadValuesToEditor(task) {[m
     document.getElementById("checked").checked = !!task.checked;[m
 }[m
 [m
[31m-[m
[31m-[m
[31m-[m
[31m-// Create , Read, Edit, Remove[m
[31m-// Title, Description Info, Image, Time, Date, Check Point, Alarm, [m
[31m-[m
 class TaskToDo {[m
     constructor(){[m
         this.checked=false;[m
[36m@@ -154,9 +115,6 @@[m [mclass TaskToDo {[m
         this.started_date=DateToDays();[m
         this.auto_remove_time=0;[m
         this.auto_remove_date=this.started_date+Settings.IntervalDays;[m
[31m-[m
[31m-        // load or create list[m
[31m-[m
     }[m
 [m
     dump() {[m
[36m@@ -185,7 +143,6 @@[m [mclass TaskToDo {[m
 class ToDoList {[m
     constructor(){[m
         this.Tasks=m_db.Tasks;[m
[31m-        // load or create list[m
     }[m
 [m
     SaveTasks(){[m
[36m@@ -212,6 +169,7 @@[m [mclass ToDoList {[m
         try {[m
             if (this.Tasks && this.Tasks[id]){[m
                 LoadValuesToEditor(this.Tasks[id]);[m
[32m+[m[32m                temp_task = this.Tasks[id];[m
                 ChangeEditorDisplay(true);[m
             }[m
         } catch (error) {[m
[36m@@ -226,7 +184,6 @@[m [mclass ToDoList {[m
         this.ShowTasks();[m
     }[m
     ShowTasks(){[m
[31m-[m
         const task_list_div = document.getElementById("TaskList");[m
         if (!task_list_div) return;[m
 [m
[36m@@ -249,6 +206,7 @@[m [mclass ToDoList {[m
             checkbox.className = 'TaskCheckBox';[m
             checkbox.name = 'TaskCheckBox';[m
             checkbox.type = 'checkbox';[m
[32m+[m[32m            checkbox.checked = task.checked;[m
 [m
             const infoButton = document.createElement('button');[m
             infoButton.className = 'TaskInfoButton';[m
[36m@@ -268,19 +226,21 @@[m [mclass ToDoList {[m
             taskDiv.appendChild(removeButton);[m
 [m
             task_list_div.appendChild(taskDiv);[m
[31m-[m
         });[m
[31m-[m
[31m-[m
[31m-    // LoadValuesToEditor();[m
     }[m
 }[m
 [m
 let MyList = new ToDoList();[m
 [m
[32m+[m[32mfunction SaveSettings(){[m
[32m+[m[32m    localStorage.setItem('Settings', JSON.stringify(Settings));[m
[32m+[m[32m}[m
 [m
 function OnClickId(id, callback){[m
[31m-    document.getElementById(id).addEventListener('click', callback);[m
[32m+[m[32m    const element = document.getElementById(id);[m
[32m+[m[32m    if (element) {[m
[32m+[m[32m        element.addEventListener('click', callback);[m
[32m+[m[32m    }[m
 }[m
 [m
 function ChangeSettingDisplay(b){[m
[36m@@ -291,43 +251,53 @@[m [mfunction ChangeEditorDisplay(b){[m
     document.getElementById('TaskEditor').style.display = b?'block':'none';[m
 }[m
 [m
[32m+[m[32mfunction SaveNewTask(){[m
[32m+[m[32m    const task = LoadEditorValues();[m
[32m+[m[32m    if (temp_task && MyList.Tasks.includes(temp_task)) {[m
[32m+[m[32m        const index = MyList.Tasks.indexOf(temp_task);[m
[32m+[m[32m        MyList.Tasks[index] = task;[m
[32m+[m[32m    } else {[m
[32m+[m[32m        MyList.Tasks.push(task);[m
[32m+[m[32m    }[m
[32m+[m[32m    MyList.SaveTasks();[m
[32m+[m[32m    MyList.ShowTasks();[m
[32m+[m[32m    ChangeEditorDisplay(false);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction CloseTaskEditor(){[m
[32m+[m[32m    ChangeEditorDisplay(false);[m
[32m+[m[32m}[m
[32m+[m
 window.addEventListener('DOMContentLoaded', () => {[m
[32m+[m[32m    const NewTaskInput = document.getElementById("NewTaskInput");[m
[32m+[m[41m    [m
     OnClickId("Setting", () => {[m
[32m+[m[32m        document.getElementById('DefaultInterval').value=Settings.IntervalDays;[m
         ChangeSettingDisplay(true);[m
     });[m
     OnClickId("SaveSettings", () => {[m
[32m+[m[32m        let backup=Settings.IntervalDays;[m
[32m+[m[32m        Settings.IntervalDays = parseInt(document.getElementById('DefaultInterval').value);[m
[32m+[m[32m        if (Settings.IntervalDays < 0 || Settings.IntervalDays > 1000000) Settings.IntervalDays=backup;[m
[32m+[m[32m        SaveSettings();[m
         ChangeSettingDisplay(false);[m
     });[m
     OnClickId("CancelSettings", () => {[m
         ChangeSettingDisplay(false);[m
     });[m
 [m
[31m-[m
     OnClickId("NewTaskButton", () => {[m
[31m-        temp_task = new TaskToDo();[m
[31m-        temp_task.title = NewTaskInput.value;[m
[31m-        LoadValuesToEditor(temp_task);[m
[31m-        ChangeEditorDisplay(true);[m
[32m+[m[32m        if (NewTaskInput) {[m
[32m+[m[32m            temp_task = new TaskToDo();[m
[32m+[m[32m            temp_task.title = NewTaskInput.value;[m
[32m+[m[32m            NewTaskInput.value="";[m
[32m+[m[32m            LoadValuesToEditor(temp_task);[m
[32m+[m[32m            ChangeEditorDisplay(true);[m
[32m+[m[32m        }[m
     });[m
 [m
[31m-    MyList.ShowTasks();[m
[31m-});[m
[32m+[m[32m    OnClickId("SaveTask", SaveNewTask);[m
[32m+[m[32m    OnClickId("CancelTask", CloseTaskEditor);[m
 [m
[31m-function SaveNewTask(){[m
[31m-    MyList.Tasks.push(LoadEditorValues());[m
     MyList.ShowTasks();[m
[31m-[m
[31m-    ChangeEditorDisplay(false);[m
[31m-[m
[31m-}[m
[31m-[m
[31m-function CloseTaskEditor(){[m
[31m-    ChangeEditorDisplay(false);[m
[31m-    MyList.ShowTasks();[m
[31m-}[m
[31m-[m
[31m-        // MyList.Tasks.push(new TaskToDo());[m
[31m-        // LoadValuesToEditor(MyList.Tasks[MyList.Tasks.length-1]);[m
[31m-[m
[31m-[m
[31m-[m
[32m+[m[32m});[m
\ No newline at end of file[m
[1mdiff --git a/server.cpp b/server.cpp[m
[1mindex 654d135..e6e84af 100644[m
[1m--- a/server.cpp[m
[1m+++ b/server.cpp[m
[36m@@ -38,9 +38,11 @@[m [mint main(){[m
 [m
     std::string HTMLCode="";[m
     std::string JavaScriptCode="";[m
[32m+[m[32m    std::string CssCode="";[m
 [m
     HTMLCode = ReadFile("ToDoList.html");[m
     JavaScriptCode = ReadFile("base.js");[m
[32m+[m[32m    CssCode = ReadFile("main.css");[m
 [m
 [m
     CROW_ROUTE(app, "/refresh")([HTMLCode]() {[m
[36m@@ -67,6 +69,14 @@[m [mint main(){[m
         return res;[m
     });[m
 [m
[32m+[m[32m    CROW_ROUTE(app, "/main.css")([CssCode]() {[m
[32m+[m[32m        crow::response res;[m
[32m+[m[32m        res.code = 200;[m
[32m+[m[32m        res.set_header("Content-Type", "text/css");[m
[32m+[m[32m        res.body = CssCode;[m
[32m+[m[32m        return res;[m
[32m+[m[32m    });[m
[32m+[m
     app.port(APIPort).multithreaded().run();[m
 [m
     return 0;[m
[1mdiff --git a/server.g++ b/server.g++[m
[1mindex 8dea669..0ad89fc 100644[m
[1m--- a/server.g++[m
[1m+++ b/server.g++[m
[36m@@ -1 +1 @@[m
[31m--lws2_32[m
\ No newline at end of file[m
[32m+[m[32m-lws2_32 -lmswsock[m
\ No newline at end of file[m
