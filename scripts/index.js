const state = {
  tasksList: [],
};

// dom manipulation of the task card going to be created

const TaskCard = document.querySelector(".task_model_body");
const taskContents = document.querySelector(".task_contents_display");

const htmlTaskCard = ({ id, url, title, description, taskType }) => `
   
    <div class="card p-2 m-4" style="width: 18rem;" id=${parseInt(
      id
    )} name=${id}>
      <div class="d-flex gap-2 justify-content-end p-2 m-1">
        <i class="fas fa-pencil text-info btn btn-outline-info border-radius-2 p-2" name=${id} id=${id} onclick='editTask()'></i>
        <i  class="fas fa-trash-alt text-danger btn btn-outline-danger border-radius-2 p-2" onclick='deleteTask()' id=${id} name=${id}></i>
      </div>
      ${
        url
          ? `<img src="${url}" class="card-img-top" alt="...">`
          : `<img src="https://usbforwindows.com/storage/img/images_3/function_set_default_image_when_image_not_present.png" class="card-img-top" alt="...">`
      }
        
        <div class="card-body">
          <h5 class="card-title p-2">${title}</h5>
          <p class="card-text p-2">${description}</p>
          <div class="p-2"> <span class="bg-warning text-dark">${taskType}</span></div>
        </div>
        <div class="d-flex justify-content-end p-2">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#displayModal" id=${id} onclick="openTask()">Open task</button>
    </div>
    </div>
     

`;
const htmlDisplayModalContents = ({
  id,
  url,
  title,
  description,
  taskType,
}) => {
  const date = new Date(parseInt(id));

  return `
  <div id=${id}>

  ${
    url
      ? `<img src="${url}" class="card-img-top" alt="...">`
      : `<img src="https://usbforwindows.com/storage/img/images_3/function_set_default_image_when_image_not_present.png" class="card-img-top" alt="...">`
  }

  <strong class="text-muted">${date.toDateString()}</strong>
  <h2 class="my-3">${title}</h2>
  <p class='lead'>${description}</p>
  <p>${taskType}</p>

  </div>`;
};

const updateLocalStorage = () => {
  localStorage.setItem("task", JSON.stringify({ tasks: state.tasksList }));
};

const loadInitialData = () => {
  const taskToLoad = JSON.parse(localStorage.task);

  if (localStorage.task) state.tasksList = taskToLoad.tasks;

  state.tasksList.map((data) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskCard(data));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  console.log(typeof id);
  const inputs = {
    url: document.getElementById("urlImg").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    taskType: document.getElementById("taskType").value,
  };
  if (inputs.title === "" && inputs.description === "" && inputs.type === "")
    alert("please fill the title,description and type");

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskCard({
      ...inputs,
      id,
    })
  );
  state.tasksList.push({ ...inputs, id });
  updateLocalStorage();
};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.tasksList.find(({ id }) => id === e.target.id);
  TaskCard.innerHTML = htmlDisplayModalContents(getTask);
};

const deleteTask = (e) => {
  if (!e) e = window.event;

  // const targetID = e.target.getAttribute('name');
  // const type = e.target.tagName;
  // console.log(type);
  // console.log(targetID);
  const removeTask = state.tasksList.filter(({ id }) => id !== e.target.id);

  const deleting = () => {
    return e.target.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode
    );
  };
  state.tasksList = removeTask;
  updateLocalStorage();
  // console.log(removeTask);
  deleting();
};

const editTask = (e) => {
  if (!e) e = window.event;

  let targetID = e.target.id;
  let parent = e.target.parentNode.parentNode;
  console.log(parent);

  let taskTitle = parent.childNodes[5].childNodes[1];
  // console.log(taskTitle)
  taskTitle.contentEditable = true;

  let taskDes = parent.childNodes[5].childNodes[3];
  taskDes.contentEditable = true;

  let taskType = parent.childNodes[5].childNodes[5];
  taskType.contentEditable = true;

  let button = parent.childNodes[7].childNodes[1];
  button.setAttribute("onclick", "saveEdit()");
  button.removeAttribute("data-bs-toggle");
  button.innerText = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;

  let targetID = e.target.id;
  let parent = e.target.parentNode.parentNode;
  let taskType = parent.childNodes[5].childNodes[5];
  let taskDes = parent.childNodes[5].childNodes[3];
  let taskTitle = parent.childNodes[5].childNodes[1];
  let button = parent.childNodes[7].childNodes[1];

  let updatedData = {
    taskTitle: taskTitle.innerText,
    taskDes: taskDes.innerText,
    taskType: taskType.innerText,
  };
  // console.log(updatedData);
  let stateCopy = state.tasksList;

  // console.log(targetID);
  console.log(stateCopy);

  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updatedData.taskTitle,
          description: updatedData.taskDes,
          taskType: updatedData.taskType,
          url: task.url,
        }
      : task
  );

  state.tasksList = stateCopy;
  updateLocalStorage();

  button.innerText = "Open Task";
  button.setAttribute("data-bs-toggle", "modal");
  button.setAttribute("onclick", "openTask()");

  taskTitle.contentEditable = false;
  taskType.contentEditable = false;
  taskDes.contentEditable = false;
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  const resultData = state.tasksList.filter(({ title }) =>
    title.includes(e.target.value)
  );
  console.log(resultData);

  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskCard(cardData))
  );
};
