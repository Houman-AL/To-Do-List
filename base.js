



let Settings = JSON.parse(localStorage.getItem("Settings")) || {
  SaveOnServer: false,
  IntervalDays: 1,
  IntervalTime: 1
};



class My_Local_Datas {
    constructor(){
        this.datas = {};
        this.datas.Tasks=[];
    }
    SaveDatas(){
        localStorage.setItem('LocalDatas', JSON.stringify(this.datas));
    }
}


// Create , Read, Edit, Remove
// Title, Discription Info, Image, Time, Date, Check Point, Alarm, 

class TaskToDo {
    constructor(){
        // load or create list
    }
}


class ToDoList {
    constructor(){
        // load or create list
    }
}


function test(){
    console.log("test");
}




