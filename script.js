/*On Document Load, pull existing comments from Local Storage
Paste them to the Comment Storage Array*/
let commentStorage = [];
window.onload = function() {
  let existingComments = JSON.parse(localStorage.commentsArray);

  for (item in existingComments) {
    let updateStorage = [existingComments[item][0], existingComments[item][1]]
    commentStorage.push(updateStorage);
    createComment(existingComments[item][0], existingComments[item][1])
  }
}

/*Save new comments posted*/
function saveComment(userName, comment) {
  let newComment = [userName, comment];
  commentStorage.push(newComment);

  localStorage.clear();
  localStorage.setItem("commentsArray", JSON.stringify(commentStorage));
}

function createComment(userName, comment) {
  const months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November",
                  "December"];
  let today = new Date();

  const body = document.querySelector("body");
  const userInput = document.querySelector("#userInput");
  const commentInput = document.querySelector("#commentInput");

  const commentSeperator = document.createElement("hr");
  commentSeperator.setAttribute("class", "commentSeperator");

  const commentSection = document.createElement("section");
  commentSection.setAttribute("id", "commentSection");

  const userProfile = document.createElement("div");
  userProfile.setAttribute("id", "userProfile");
  const userPostDate = document.createElement("div");
  userPostDate.setAttribute("id", "userPostDate");

  const userImage = document.createElement("img");
  userImage.setAttribute("src", "images/user.png");
  userImage.setAttribute("alt", "User image");
  userImage.setAttribute("id", "userImage");

  const commentDate = document.createElement("span");
  commentDate.setAttribute("id", "commentDate")
  commentDate.textContent = `${months[today.getMonth()]} ${today.getFullYear()}`;

  const userNameLabel = document.createElement("h4");
  userNameLabel.setAttribute("id", "userName");
  userNameLabel.textContent = userName;

  const newComment = document.createElement("pre");
  newComment.setAttribute("id", "newComment");
  newComment.textContent = comment;

  userPostDate.appendChild(userNameLabel);
  userPostDate.appendChild(commentDate);

  userProfile.appendChild(userImage);
  userProfile.appendChild(userPostDate);

  commentSection.appendChild(userProfile);
  commentSection.appendChild(newComment);

  body.appendChild(commentSeperator);
  body.appendChild(commentSection);
}

/*Action for comment submit button*/
const submitButton = document.querySelector("#submitButton");

submitButton.addEventListener("click", () => {
  userName = document.querySelector("#userInput").value;
  comment = document.querySelector("#commentInput").value;

  createComment(userName, comment);

  /*Save comment to Local Storage*/
  saveComment(userInput.value, commentInput.value);
});
