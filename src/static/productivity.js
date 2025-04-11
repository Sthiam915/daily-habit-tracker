const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
let user_data;
let initialized;
let day;
let archive;
let taskdata;
let dataday;
let daysActive;
let tasks;
let runnable = false;
var tasks_today;
const DAY_LENGTH = 86400000;
var x = new Date();
var today = Math.floor(x.getTime()/DAY_LENGTH) + 1;

if (document.cookie.length == 10 || document.cookie == "") {
  fetch("/login").then((response) => (window.location.href = response.url));
}
fetch(`get-userdata/${document.cookie.slice(10)}`, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    user_data = data;
    initialized = user_data["initialized"];
    day = user_data["day"];
    archive = user_data["archive"];
    taskdata = user_data["taskdata"];
    dataday = user_data["dataday"];
    daysActive = user_data["daysactive"];
    tasks = user_data["tasks"];
    run_main();

    runnable = true;
    update_text();
    if (initialized != 0) {
      update_day();
      render_data();
    }
  });

function run_main() {
  if (daysActive.length == 0) {
    daysActive.push(today);
  }
  update_day();
}

function log_out() {
  document.cookie =
    "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  fetch("/login").then((response) => (window.location.href = response.url));
}
function update_day() {
  let last_day = daysActive[daysActive.length - 1]
  let day_difference = today - last_day;

  if(day_difference < 0){
    return;
  }
  
  for(z = 0; z < day_difference; z++) {
    daysActive.push(last_day + z + 1);
    new_day();
  }
  save_data();
}
function save_data() {
  user_data["day"] = day;
  user_data["archive"] = archive;
  user_data["initialized"] = initialized;
  user_data["taskdata"] = taskdata;
  user_data["dataday"] = dataday;
  user_data["daysactive"] = daysActive;
  user_data["tasks"] = tasks;
  fetch(`update-user-data/${document.cookie.slice(10)}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user_data),
  });
}

function update_text() {
  tasks_today = 0;

  for (i = 0; i < tasks.length; i++) {
    if (taskdata[day][i + 1][1] != "complete") {
      tasks_today++;
    }
  }
  if (initialized == 0) {
    document.getElementById("explainer").textContent =
      'Welcome to your new task manager. Please add some tasks using the "Add Task" menu.';
  }
  if (initialized == 1) {
    document.getElementById("explainer").textContent =
      "Click on the unfinished task block to complete the task.";
  }
  if (initialized == 2) {
    if (tasks_today == 1) {
      document.getElementById(
        "explainer"
      ).textContent = `Welcome, ${user_data["name"]}. You have ${tasks_today} task remaining today.`;
      return;
    }
    document.getElementById(
      "explainer"
    ).textContent = `Welcome, ${user_data["name"]}. You have ${tasks_today} tasks remaining today.`;
  }
}

let taskout = "";
let task = document.getElementById("taskin");
task.value = "";

var createTask = document.getElementById("create-task");
createTask.onmouseover = function () {
  createTask.style.width = "120px";
  createTask.style.backgroundColor = "rgba(0,0,0,0.2)";
  createTask.style.color = "rgba(0,0,0,0.4)";
  document.getElementById("add").style.right = "17px";
  document.getElementById("add").style.opacity = "1";
};
createTask.onmouseleave = function () {
  createTask.style.width = "100px";
  createTask.style.color = "rgba(255,255,255,0.35)";
  createTask.style.backgroundColor = "rgba(255,255,255,0.2)";
  document.getElementById("add").style.right = "1px";
  setTimeout(() => {
    document.getElementById("add").style.opacity = "0";
  }, 100);
};

function create_task() {
  var create = document.getElementById("create-task");
  var task_input = document.getElementById("taskin");
  var add = document.getElementById("add");
  var confirm = document.getElementById("confirm-addition");
  var twist = document.getElementById("add2");
  create.onmouseleave = function () {
    return;
  };
  add.style.right = "17px";
  twist.style.transform = "rotate(90deg)";
  setTimeout(() => {
    confirm.style.cursor = "pointer";
    confirm.style.right = "36px";
    confirm.style.opacity = "1";
    confirm.style.width = "48px";
    confirm.style.height = "12px";
    task_input.style.opacity = "1";
    task_input.style.width = "90%";
    task_input.style.left = "5%";

    task_input.style.bottom = "10px";
  }, 200);
  setTimeout(() => {
    create.onclick = function () {
      return;
    };
    add.onclick = function () {
      minimize_task_create();
    };
  }, 400);
  add.style.opacity = "1";

  create.style.cursor = "default";
  add.style.cursor = "pointer";
  create.style.height = "60px";
  create.style.width = "120px";
  create.style.backgroundColor = "rgba(0,0,0,0.2)";
  create.style.color = "rgba(0,0,0,0.4)";
}
function minimize_task_create() {
  var create = document.getElementById("create-task");
  var task_input = document.getElementById("taskin");
  var add = document.getElementById("add");
  var confirm = document.getElementById("confirm-addition");
  var twistl = document.getElementById("add2");

  twistl.style.transform = "rotate(0deg)";
  createTask.onmouseleave = function () {
    add.style.right = "1px";
    setTimeout(() => {
      add.style.opacity = "0";
    }, 100);
    create.style.width = "100px";
    create.style.color = "rgba(255,255,255,0.35)";
    create.style.backgroundColor = "rgba(255,255,255,0.2)";
  };

  confirm.style.cursor = "default";
  confirm.style.height = "0";
  confirm.style.width = "0";

  confirm.style.right = "3000px";
  confirm.style.opacity = "0";
  task_input.style.width = "0";
  task_input.style.right = "-100px";
  create.style.height = "20px";
  create.style.cursor = "pointer";
  setTimeout(() => {
    add.onclick = function () {
      return;
    };
    create.onclick = function () {
      create_task();
    };
  }, 400);
}

function add_task() {
  if (task.value == "") {
    alert("Task name cannot be empty");
    return;
  }
if (task.value.length > 50) {
  alert("Task name cannot exceed 50 characters");
  task.value = "";
  return;
}
  if (tasks.includes(task.value)) {
    alert("Task already exists");
    return;
  }
  if (initialized == 0) {
    initialized = 1;
  }
  dataday.push([]);

  dataday[dataday.length - 1].push(task.value);
  dataday[dataday.length - 1].push("incomplete");

  tasks.push(task.value);
  taskdata[taskdata.length - 1] = dataday;
  dataday[0][1] = Math.trunc(
    (dataday[0][2] / ((dataday.length - 1) * 2)) * 100
  );
  task.value = "";
  render_data();
  minimize_task_create();
  save_data();
}

function update_block(item) {
  initialized = 2;

  index = item.id.split(":");
  index[0] = Number(index[0]);
  index[1] = Number(index[1]);
  if (taskdata[index[0]][index[1]][1] == "incomplete") {
    taskdata[index[0]][index[1]][1] = "partial";
    taskdata[index[0]][0][2] += 1;
    taskdata[index[0]][0][1] = Math.trunc(
      (taskdata[index[0]][0][2] / ((taskdata[index[0]].length - 1) * 2)) * 100
    );
  } else if (taskdata[index[0]][index[1]][1] == "partial") {
    taskdata[index[0]][index[1]][1] = "complete";
    taskdata[index[0]][0][2] += 1;
    taskdata[index[0]][0][1] = Math.trunc(
      (taskdata[index[0]][0][2] / ((taskdata[index[0]].length - 1) * 2)) * 100
    );
  } else if (taskdata[index[0]][index[1]][1] == "complete") {
    taskdata[index[0]][index[1]][1] = "incomplete";
    taskdata[index[0]][0][2] -= 2;
    taskdata[index[0]][0][1] = Math.trunc(
      (taskdata[index[0]][0][2] / ((taskdata[index[0]].length - 1) * 2)) * 100
    );
  }

  document.getElementById("score" + index[0].toString()).style.color =
    "rgba(0,0,0,0.3)";
  document.getElementById("score" + index[0].toString()).style.backgroundColor =
    getColor(taskdata[index[0]][0][1])[0];
  temp_day = new Date(daysActive[index[0]] * DAY_LENGTH);
  document.getElementById("score" + index[0].toString()).innerHTML =
    "<br>" +
    months[temp_day.getMonth()] +
    " " +
    temp_day.getDate() +
    ", " +
    temp_day.getFullYear() +
    "\n" +
    taskdata[index[0]][0][1].toString() +
    "%";
  document.getElementById("score" + index[0].toString()).style.borderColor =
    getColor(taskdata[index[0]][0][1])[1];
  save_data();
  update_text();
}

function new_day() {  
  day = day + 1;
  taskdata.push(dataday);

  dataday = [];
  dataday.push([day]);
  dataday[0].push(0.0);
  dataday[0].push(0.0);

  for (i = 0; i < tasks.length; i++) {
    dataday.push([]);

    dataday[i + 1].push(tasks[i]);
    dataday[i + 1].push("incomplete");
  }

  taskdata[taskdata.length - 1] = dataday;
  render_data();
}

function getColor(score) {
  score = score / 100;
  if (score < 0.5) {
    let x = 0;
    x += 510 * score;
    x = Math.trunc(x);
    return [
      "rgb(255," + x.toString() + ",0)",
      "rgb(200," + Math.max(0, x - 35).toString() + ",0)",
      "rgb(170," + Math.max(0, x - 55).toString() + ",0)",
    ];
  } else if (score >= 0.5) {
    let x = 255;
    x -= 510 * (score - 0.5);
    x = Math.trunc(x);
    return [
      "rgb(" + x.toString() + ",255,0)",
      "rgb(" + Math.max(0, x - 35).toString() + ",200,0)",
      "rgb(" + Math.max(0, x - 55).toString() + ",170,0)",
    ];
  } else {
    return "rgb(255,255,0)";
  }
}

/*
    Render tasks and daily scores as colored blocks 
    for each day since first day user joined, and 
    render headers as grey blocks, handling settings
    for each task

    I create each block using raw js, leading
    to very verbose function
*/
function render_data() {
  update_text();
  lasticonpressed = "null";
  const block_menus = document.getElementById("block-menus");
  document.getElementById("rows").innerHTML = "";
  document.getElementById("block-menus").innerHTML = "";
  const head = document.createElement("div");
  head.setAttribute("class", "head");
  const space = document.createElement("div");
  space.setAttribute("class", "headblock");
  space.style.width = "100px";
  space.innerHTML = "Daily Score";
  head.appendChild(space);
  document.getElementById("rows").appendChild(head);
  var pos = 100;

  for (i = 0; i < tasks.length; i++) {
    const headblock = document.createElement("div");
    headblock.setAttribute("class", "headblock");
    headblock.setAttribute("id", "headblock" + ":" + tasks[i]);
    headblock.style.left = pos.toString() + "px";
    pos += 120;
    const hicon = document.createElement("img");
    const hmenu = document.createElement("div");
    hmenu.setAttribute("id", "hmenu" + ":" + i.toString());
    hmenu.style.zIndex = 0;
    hmenu.style.opacity = "0%";
    hicon.style.transform = "rotate(0deg)";
    hicon.setAttribute("src", "/static/settings.png");
    hicon.setAttribute("id", "hicon" + ":" + i.toString());
    hicon.onclick = function () {
      showHeadSettings(hmenu, hicon);
    };
    hicon.style.opacity = "50%";
    hmenu.setAttribute("class", "headblock-menu");
    hicon.setAttribute("class", "material-symbols-outlined headblock-options");

    //putting the name of the task into the head block
    const headblock_name = document.createElement("p");
    headblock_name.setAttribute("id", "headblock_text" + ":" + tasks[i]);
    headblock_name.setAttribute("class", "headblock-text");
    headblock_name.textContent = tasks[i];
    headblock.appendChild(headblock_name);

    //appending the name of the task to the head menu
    const hmenu_task_name = document.createElement("p");
    hmenu_task_name.setAttribute("class", "headblock-menu-taskname");
    if (tasks[i].length > 15) {
      hmenu_task_name.textContent = tasks[i].slice(0, 15) + "...";
    } else {
      hmenu_task_name.textContent = tasks[i];
    }
    hmenu.appendChild(hmenu_task_name);

    //setting up the buttons for deleting and editing tasks
    const hmenu_content_delete = document.createElement("p");
    const hmenu_content_edit = document.createElement("p");
    const hmenu_content_new = document.createElement("input");
    const hmenu_content_confirm = document.createElement("p");

    hmenu_content_delete.setAttribute("class", "headblock-menu-content");
    hmenu_content_edit.setAttribute("class", "headblock-menu-content");
    hmenu_content_new.setAttribute("class", "headblock-menu-input");
    hmenu_content_new.setAttribute("type", "text");
    hmenu_content_new.setAttribute("placeholder", "new task name");
    hmenu_content_new.setAttribute("id", "input" + ":" + i.toString());
    hmenu_content_confirm.setAttribute("class", "headblock-menu-confirm");
    hmenu_content_confirm.setAttribute("id", "confirm" + ":" + i.toString());

    hmenu_content_delete.textContent = "Delete Dask";
    hmenu_content_edit.textContent = "Edit Task";
    hmenu_content_confirm.textContent = "Confirm";

    const current_num = i;
    hmenu_content_delete.onclick = function () {
      delete_task(current_num);
    };
    hmenu_content_edit.onclick = function () {
      edit_task(current_num);
    };
    hmenu_content_confirm.onclick = function () {
      confirm_edit(current_num);
    };

    hmenu.appendChild(hmenu_content_delete);
    hmenu.appendChild(hmenu_content_edit);
    hmenu.appendChild(hmenu_content_new);
    hmenu.appendChild(hmenu_content_confirm);

    headblock.appendChild(hicon);
    block_menus.appendChild(hmenu);

    //put block into head
    head.appendChild(headblock);
  }

  for (i = taskdata.length - 1; i >= 0; i--) {
    taskday = document.createElement("div");
    taskday.setAttribute("class", "taskday");
    document.getElementById("rows").appendChild(taskday);

    block_day = new Date(daysActive[i] * DAY_LENGTH);

    const scoreblock = document.createElement("span");
    scoreblock.innerHTML =
      "<br>" +
      months[block_day.getMonth()] +
      " " +
      block_day.getDate() +
      ", " +
      block_day.getFullYear() +
      "\n" +
      taskdata[i][0][1].toString() +
      "%";
    scoreblock.setAttribute("class", "scoreblock");
    scoreblock.setAttribute("id", "score" + taskdata[i][0][0].toString());
    scoreblock.style.color = "rgba(0,0,0,0.3)";
    scoreblock.style.borderColor = getColor(taskdata[i][0][1])[1];
    scoreblock.style.backgroundColor = getColor(taskdata[i][0][1])[0];
    taskday.appendChild(scoreblock);
    for (k = 1; k < taskdata[i].length; k++) {
      const taskBlock = document.createElement("span");
      taskBlock.setAttribute("class", "taskBlock");
      taskBlock.setAttribute(
        "id",
        taskdata[i][0][0].toString() + ":" + k.toString()
      );

      const taskBlock_red = document.createElement("div");
      const red_text = document.createElement("p");
      red_text.innerHTML = "Not Started";
      red_text.setAttribute("class", "color-text");
      taskBlock_red.appendChild(red_text);
      taskBlock_red.style.backgroundColor = "rgb(255,0,0)";
      taskBlock_red.style.borderColor = "rgb(200,0,0)";
      if (day - taskdata[i][0][0] < 3) {
        taskBlock_red.style.color = "rgba(0,0,0,0.6)";
      }

      const taskBlock_yellow = document.createElement("div");
      const yellow_text = document.createElement("p");
      yellow_text.innerHTML = "Almost Done";
      yellow_text.setAttribute("class", "color-text");
      taskBlock_yellow.appendChild(yellow_text);
      taskBlock_yellow.style.backgroundColor = "rgb(255,255,0)";
      taskBlock_yellow.style.borderColor = "rgb(200,200,0)";

      const taskBlock_green = document.createElement("div");
      const green_text = document.createElement("p");
      green_text.innerHTML = "Finished";
      green_text.setAttribute("class", "color-text");
      taskBlock_green.appendChild(green_text);
      taskBlock_green.style.backgroundColor = "rgb(0,255,0)";
      taskBlock_green.style.borderColor = "rgb(0,200,0)";

      taskBlock.appendChild(taskBlock_red);
      taskBlock.appendChild(taskBlock_yellow);
      taskBlock.appendChild(taskBlock_green);
      taskBlock.style.left = (100 + 120 * (k - 1)).toString() + "px";
      children = taskBlock.children;

      if (taskdata[i][k][1] == "incomplete") {
        children[0].setAttribute("class", "color");
        children[1].setAttribute("class", "color-closing");
        children[2].setAttribute("class", "color-closing");
      } else if (taskdata[i][k][1] == "partial") {
        children[0].setAttribute("class", "color-closing");
        children[1].setAttribute("class", "color");
        children[2].setAttribute("class", "color-closing");
      } else if (taskdata[i][k][1] == "complete") {
        children[0].setAttribute("class", "color-closing");
        children[1].setAttribute("class", "color-closing");
        children[2].setAttribute("class", "color");
      }

      if (day - taskdata[i][0][0] >= 3) {
        taskBlock.onclick = function () {
          alert("You can't update tasks that are more than 3 days old");
        };
      }
      if (day - taskdata[i][0][0] < 3) {
        taskBlock.onclick = function () {
          nextColor(taskBlock);
        };
      }

      taskday.appendChild(taskBlock);
    }
    if (taskdata[i][0].length == 4) {
      const archive_line = document.createElement("div");
      archive_line.setAttribute("class", "head");
      const archive_block_space = document.createElement("div");
      archive_block_space.setAttribute("class", "headblock");
      archive_block_space.style.width = "100px";
      archive_block_space.innerHTML = "Old tasks";
      archive_line.appendChild(archive_block_space);
      document.getElementById("rows").appendChild(archive_line);
      pos = 100;
      for (k = 1; k < archive[taskdata[i][0][3]].length; k++) {
        const archive_block = document.createElement("div");
        archive_block.setAttribute("class", "headblock");
        archive_block.style.left = pos.toString() + "px";
        pos += 120;

        archive_block.innerHTML = archive[taskdata[i][0][3]][k];
        archive_line.appendChild(archive_block);
      }
    }
  }
}

let isAnimating = false;

let animating = "";

function nextColor(item, color) {
  if (animating == item.id) {
    return;
  }

  index = item.id.split(":");
  index[0] = Number(index[0]);
  index[1] = Number(index[1]);
  colors = item.children;
  var red = colors[0];
  var yellow = colors[1];
  var green = colors[2];
  animating = item.id;
  if (taskdata[index[0]][index[1]][1] == "incomplete") {
    yellow.style.zIndex = "2";
    yellow.style.height = "100%";
    yellow.style.top = "0";
    yellow.style.width = "100%";
    yellow.style.left = "0";
    yellow.style.color = "rgba(0,0,0,0)";
    yellow.setAttribute("class", "color");

    red.style.width = "0";
    red.style.height = "0";
    red.style.left = "50%";
    red.style.top = "50%";
    red.style.zIndex = "0";
    red.style.color = "rgba(0,0,0,0.6)";
    red.setAttribute("class", "color-closing");

    color = "yellow";
  } else if (taskdata[index[0]][index[1]][1] == "partial") {
    green.style.zIndex = "2";
    green.style.height = "100%";
    green.style.top = "0";
    green.style.width = "100%";
    green.style.left = "0";
    green.style.color = "rgba(0,0,0,0)";
    green.setAttribute("class", "color");

    yellow.style.width = "0";
    yellow.style.height = "0";
    yellow.style.left = "50%";
    yellow.style.top = "50%";
    yellow.style.zIndex = "0";
    yellow.style.color = "rgba(0,0,0,0.6)";
    yellow.setAttribute("class", "color-closing");

    color = "green";
  }
  if (taskdata[index[0]][index[1]][1] == "complete") {
    red.style.zIndex = "2";
    red.style.height = "100%";
    red.style.top = "0";
    red.style.width = "100%";
    red.style.left = "0";
    red.style.color = "rgba(0,0,0,0)";
    red.setAttribute("class", "color");

    green.style.width = "0";
    green.style.height = "0";
    green.style.left = "50%";
    green.style.top = "50%";
    green.style.zIndex = "0";
    green.style.color = "rgba(0,0,0,0.6)";
    green.setAttribute("class", "color-closing");

    color = "red";
  }
  update_block(item);
  setTimeout(() => {
    animating = "";
  }, 400);
}

var lasticonpressed = "null";

function showHeadSettings(a, b) {
  if (a.style.opacity == "0") {
    let backdrop = document.getElementById("backdrop");
    backdrop.onclick = function () {
      minimize_all(a.id.split(":")[a.id.split(":").length - 1]);
    };
    backdrop.style.width = "100%";
    backdrop.style.height = "100%";
    backdrop.style.backgroundColor = "black";
    backdrop.style.opacity = "0.2";
    backdrop.style.top = "0";
    backdrop.style.left = "0";
    backdrop.style.zIndex = "10";

    if (lasticonpressed[0] == "h") {
      var c = document.getElementById(lasticonpressed);

      var d = document.getElementById(
        "hicon" + ":" + c.id.split(":")[c.id.split(":").length - 1]
      );
      c.style.bottom = "0px";
      c.style.zIndex = "-5";
      c.style.opacity = "0";
      d.style.transform = "rotate(0deg)";

      minimize(c.id.split(":")[c.id.split(":").length - 1]);
    }
    a.style.bottom = "10px";
    b.style.transform = "rotate(-90deg)";
    a.style.zIndex = "100";
    a.style.opacity = "1";
    lasticonpressed = a.id;
  } else {
    a.style.bottom = "0px";
    b.style.transform = "rotate(0deg)";
    a.style.zIndex = "-5";
    a.style.opacity = "0";
    minimize(a.id[a.id.split(":")[a.id.split(":") - 1]]);
  }
}

function delete_task(task_number) {
  if (tasks.length == 1) {
    alert("You must have at least one task");
    showHeadSettings(
      document.getElementById("hmenu" + task_number),
      document.getElementById("hicon" + ":" + task_number)
    );
    return;
  }
  if (!day == 0 && dataday[0].length == 3) {
    archive.push([day]);
    for (i = 0; i < tasks.length; i++) {
      archive[archive.length - 1].push(tasks[i]);
    }
    dataday[0].push(archive.length - 1);
  }
  document.getElementById("headblock" + ":" + tasks[task_number]).remove();
  tasks.splice(task_number, 1);
  if (taskdata[day][task_number + 1][1] == "complete") {
    taskdata[day][0][2] -= 2;
  } else if (taskdata[day][task_number + 1][1] == "partial") {
    taskdata[day][0][2] -= 1;
  }
  dataday.splice(task_number + 1, 1);
  dataday[0][1] = Math.trunc(
    (taskdata[day][0][2] / ((taskdata[day].length - 1) * 2)) * 100
  );
  taskdata[day].splice(task_number + 1, 1);
  taskdata[day][0][1] = Math.trunc(
    (taskdata[day][0][2] / ((taskdata[day].length - 1) * 2)) * 100
  );
  lasticonpressed = "null";
  minimize_all(task_number);
  render_data();
  save_data();
}
function edit_task(task_number) {
  const edit_input = document.getElementById("input" + ":" + task_number);
  const confirm_text = document.getElementById("confirm" + ":" + task_number);
  const menu = document.getElementById("hmenu" + ":" + task_number);
  const to_edit = document.getElementById(
    "headblock_text" + ":" + tasks[task_number]
  );

  //making input box visible
  edit_input.style.height = "12px";
  edit_input.style.width = "70%";
  edit_input.style.opacity = "100%";
  edit_input.style.cursor = "text";

  //making confirm text visible
  confirm_text.style.opacity = "100%";
  confirm_text.style.cursor = "pointer";

  //sizing up menu
  menu.style.height = "153px";
}

function minimize(task_number) {
  const edit_input = document.getElementById("input" + ":" + task_number);
  const confirm_text = document.getElementById("confirm" + ":" + task_number);
  const menu = document.getElementById("hmenu" + ":" + task_number);

  menu.style.bottom = "0px";
  menu.style.zIndex = "-5";
  menu.style.opacity = "0";

  edit_input.style.height = "0px";
  edit_input.style.width = "0px";
  edit_input.style.opacity = "0%";
  edit_input.style.cursor = "default";
  edit_input.value = "";

  confirm_text.style.opacity = "0%";

  setTimeout(() => {
    menu.style.height = "98px";
  }, 300);
}

function confirm_edit(task_number) {
  const edit_input = document.getElementById("input" + ":" + task_number);
  const to_edit = document.getElementById(
    "headblock_text" + ":" + tasks[task_number]
  );
  const menu = document.getElementById("hmenu" + ":" + task_number);

  if (
    !tasks.includes(edit_input.value) &&
    edit_input.value != "" &&
    edit_input.value.length <= 50
  ) {
    to_edit.textContent = edit_input.value;
    tasks[task_number] = edit_input.value;
    taskdata[day][task_number + 1][0] = edit_input.value;
    dataday[task_number + 1][0] = edit_input.value;
    to_edit.id = "headblock_text" + ":" + edit_input.value;

    menu.firstChild.textContent = edit_input.value;

    minimize_all(task_number);
    setTimeout(() => {
      render_data();
    }, 300);
  } else {
    if (edit_input.value == "") {
      alert("Task name cannot be empty");
    } else if (edit_input.value.length > 50) {
      alert("Task name cannot exceed 50 characters");
    } else {
      alert("Task already exists");
    }
  }

  save_data();
}

function minimize_all(num) {
  minimize(num);
  let backdrop = document.getElementById("backdrop");
  minimize_task_create();
  backdrop.style.width = "0";
  backdrop.style.height = "0";
  backdrop.style.zIndex = "0";
  backdrop.style.opacity = "0";
  backdrop.style.left = "50%";
  backdrop.style.bottom = "25%";
}