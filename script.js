/*On Document Load, pull existing comments from Local Storage
Paste them to the Comment Storage Array*/
let commentStorage = [];
window.onload = function() {
  /*Clear Comment Input Values*/
  userInput.value = "";
  commentInput.value = "";

  /*Load pre-existing comments if there are any*/
  if (localStorage.commentsArray) {
    let existingComments = JSON.parse(localStorage.commentsArray);
    for (item in existingComments) {
      //let updateStorage = [existingComments[item][0], existingComments[item][1]]
      commentStorage.push(existingComments[item]);
      createComment(existingComments[item].userName, existingComments[item].comment);
    }
  }
}

window.onclick = () => {
  if (!event.target.matches(".dropdownButton")) {
    let dropdownContent = document.querySelectorAll(".dropdownContent");

    for (i = 0; i < dropdownContent.length; i++) {
      if (dropdownContent[i].classList.contains("show")) {
        dropdownContent[i].classList.remove("show");
      }
    }
  }
}

/*Enable / Disable submit button*/
const userInput = document.querySelector("#userInput");
const commentInput = document.querySelector("#commentInput");

userInput.addEventListener("input", buttonEnableDisable);
commentInput.addEventListener("input", buttonEnableDisable);

function buttonEnableDisable() {
  if (userInput.value && commentInput.value) {
    submitButton.classList.remove("disabled");
  }
  else {
    submitButton.classList.add("disabled");
  }
}

/*Action for comment submit button*/
const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", () => {
  userName = document.querySelector("#userInput").value;
  comment = document.querySelector("#commentInput").value;

  if (userName && comment) {
    submitButton.classList.remove("disabled");
    createComment(userName, comment);

    /*Scroll Window to Added Comment*/
    window.scrollTo(0, document.body.scrollHeight);

    /*Save comment to Local Storage*/
    saveComment(userInput.value, commentInput.value);

    /*Clear Inputs*/
    userInput.value = "";
    commentInput.value = "";

    /*Disable Button*/
    submitButton.classList.add("disabled");
  }
});

/*Save new comments posted*/
function saveComment(userName, comment) {
  let newComment = {userName: userName, comment: comment};
  commentStorage.push(newComment);

  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(commentStorage));
}

/*Edit posted comment*/
function editComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  let userPostDate = commentItem.children[0].children[1];
  let userName = userPostDate.children[0];
  let postDate = userPostDate.children[1];
  let comment = commentItem.children[1];

  const userInput = document.createElement("input");
  const commentInput = document.createElement("input");
  const saveEdit = document.createElement("button");

  userInput.value = userName.textContent;
  commentInput.value = comment.textContent;

  userName.remove();
  comment.remove();
  userPostDate.insertBefore(userInput, postDate);
  commentItem.append(commentInput);
}

/*Delete posted comment*/
function deleteComment(e) {
  let commentItem = e.target.parentNode.parentNode.parentNode.parentNode;
  commentItem.previousSibling.remove();
  commentItem.remove()
}

function createComment(userName, comment) {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November",
                  "December"];
  let today = new Date();

  const body = document.querySelector("body");

  const commentSeperator = document.createElement("hr");
  commentSeperator.setAttribute("class", "commentSeperator");

  const commentItem = document.createElement("section");
  commentItem.setAttribute("class", "commentItem");

  const userProfile = document.createElement("div");
  userProfile.setAttribute("class", "userProfile");
  const userPostDate = document.createElement("div");
  userPostDate.setAttribute("class", "userPostDate");

  const userImage = document.createElement("img");
  userImage.setAttribute("src", "images/user.png");
  userImage.setAttribute("alt", "User image");
  userImage.setAttribute("class", "userImage");

  const commentDate = document.createElement("span");
  commentDate.setAttribute("class", "commentDate")
  commentDate.textContent = `${months[today.getMonth()]} ${today.getFullYear()}`;

  const userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("class", "userName");
  userNameLabel.textContent = userName;

  const newComment = document.createElement("pre");
  newComment.setAttribute("class", "newComment");
  newComment.textContent = comment;

  const dropdown = document.createElement("div");
  const editDelete = document.createElement("button");
  const dropdownContent = document.createElement("div");
  const editButton = document.createElement("p");
  const deleteButton = document.createElement("p");
  dropdown.setAttribute("class", "dropdown");
  editDelete.addEventListener("click", () => dropdownContent.classList.toggle("show"));
  editDelete.setAttribute("class", "dropdownButton");
  dropdownContent.setAttribute("class", "dropdownContent");
  editButton.textContent = "edit";
  editButton.addEventListener("click", editComment)
  deleteButton.textContent = "delete";
  deleteButton.addEventListener("click", deleteComment)
  dropdownContent.appendChild(editButton);
  dropdownContent.appendChild(deleteButton);
  dropdown.appendChild(editDelete);
  dropdown.appendChild(dropdownContent);


  userPostDate.appendChild(userNameLabel);
  userPostDate.appendChild(commentDate);

  userProfile.appendChild(userImage);
  userProfile.appendChild(userPostDate);
  userProfile.appendChild(dropdown);

  commentItem.appendChild(userProfile);
  commentItem.appendChild(newComment);

  commentSection.insertBefore(commentItem, commentSection.firstChild);
  commentSection.insertBefore(commentSeperator, commentSection.firstChild);

  body.appendChild(commentSection);
}
