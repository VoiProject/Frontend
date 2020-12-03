let api = window.location.origin + '/api/'
let websiteUrl = window.location.origin

function getFeed() {
  let currentUrl = new URL(window.location.href);
  let feedPage = Number.parseInt(currentUrl.searchParams.get('page'));

  feedPage = (Number.isNaN(feedPage)) ? 1 : feedPage;

  const id = getCookie('user_id');
  renderFeedData(fetch(api + 'feed/' + feedPage), feedPaging, feedPage);
}

function activateSearch(feedPage) {
  feedPage = (Number.isNaN(feedPage)) ? 1 : feedPage;

  const params = {
    query: document.getElementById("query_text").value,
  }
  console.log(params);
  console.log(feedPage);
  renderFeedData(fetch(api + 'search/posts/' + feedPage, {
    method: 'POST',
    body: JSON.stringify(params),
  }), searchPaging, feedPage);
}

function renderFeedData(promise, paginationCallback, feedPage) {
  feedPage = (Number.isNaN(feedPage)) ? 1 : feedPage;

  promise.then((response) => response.json())
    .then(data => {
      console.log(data);

      let feed = document.getElementById('main_feed');
      feed.innerHTML = "";

      let posts = data['user_feed'];
      console.log(data['pages_count'] + ' - ' + feedPage);
      posts.forEach((post) => {
        addPostPreview(post['post']['title'], post['post']['short_description'],
          post['author_login'], post['post']['author_id'], post['post']['id'], post['likes_count'], post['liked_by_user'], post['comments_count'], post['post']['audio_link']);
      });

      paginationCallback(feedPage, data);
    });
}

function feedPaging(feedPage, data) {
  let pagination = document.getElementById('feed_pagination');
  let str = '<ul class="pagination center">\n';
  str += '\t<li class="' + (feedPage == 1 ? 'disabled' : 'waves-effect') + '"><a href="' + (feedPage == 1 ? '#' : websiteUrl + '/index.html?page=' + (feedPage - 1)) + '"><i class="material-icons">chevron_left</i></a></li>\n';

  for (i = 1; i <= data['pages_count']; i++) {
    str += '\t<li class="' + (i == feedPage ? 'green active' : 'waves-effect') + '"><a href="' + websiteUrl + '/index.html?page=' + i + '">' + i + '</a></li>\n';
  }

  str += '\t<li class="' + (feedPage == data['pages_count'] ? 'disabled' : 'waves-effect') + '"><a href="' + (feedPage == data['pages_count'] ? '#' : websiteUrl + '/index.html?page=' + (feedPage + 1)) + '"><i class="material-icons">chevron_right</i></a></li>\n';
  str += '</ul>';
  pagination.innerHTML = str;
}

function searchPaging(feedPage, data) {
  let pagination = document.getElementById('feed_pagination');
  let str = '<ul class="pagination center">\n';
  str += '\t<li class="' + (feedPage == 1 ? 'disabled' : 'waves-effect') + '"><a onclick="activateSearch(' + (feedPage == 1 ? '1' : (feedPage - 1)) + ')"><i class="material-icons">chevron_left</i></a></li>\n';

  for (i = 1; i <= data['pages_count']; i++) {
    str += '\t<li class="' + (i == feedPage ? 'green active' : 'waves-effect') + '"><a onclick="activateSearch(' + i + ')">' + i + '</a></li>\n';
  }

  str += '\t<li class="' + (feedPage == data['pages_count'] ? 'disabled' : 'waves-effect') + '"><a onclick="activateSearch(' + (feedPage == data['pages_count'] ? data['pages_count'] : (feedPage + 1)) + ')"><i class="material-icons">chevron_right</i></a></li>\n';
  str += '</ul>';
  pagination.innerHTML = str;
}

function addPostPreview(title, shortDescription, author, authorId, postId, likes, isLiked, commentCount, audio_link) {
  let feed = document.getElementById('main_feed');

  newPost = '<div class="card darken-1">\n\t<div class="card-content">\n';
  newPost += '\t\t<span class="card-title">' + title + '</span>\n';
  newPost += '\t\t<p>' + shortDescription + '</p>\n';
  newPost += '\t</div>\n\t<div class="card-action">\n';

  newPost += '\t\t <audio style="padding: 10px; width: 100%;" controls="" src="api/audio/' + audio_link + '" preload="none"></audio>\n';

  newPost += '\t\t<a href="' + websiteUrl + '/post.html?id=' + postId + '">FULL</a>\n';
  if (authorId != -1) {
    newPost += '\t\t<span class="grey-text"><a href="profile.html?id=' + authorId + '">' + author + '</a>' + '</span>\n';
  }
  newPost += '\t\t<div class="likes"><span class="count-num">' + commentCount + '</span><span class="material-icons">comment</span><span class="count-num" id="like_count' + postId + '">' + likes + '</span><span id="like_' + postId + '" onclick="likePost(' + postId + ')" class="material-icons' + (isLiked ? ' red-text' : '') + '">' + (isLiked ? 'favorite' : 'favorite_border') + '</span></div>'
  newPost += '\t</div>\n</div>\n\n';

  feed.innerHTML += newPost;
}

function likePost(postId) {
  fetch(api + 'post/like/' + postId, {
    method: 'POST',
  })
    .then((response) => response.json())
    .then(likeData => {
      let likeBtn = document.getElementById('like_' + postId);
      let likeCunt = document.getElementById('like_count' + postId);
      likeBtn.innerHTML = (likeData['like_state'] ? 'favorite' : 'favorite_border');
      if (likeData['like_state']) {
        console.log('like post ' + postId);
        likeBtn.classList.add('red-text');
        likeCunt.innerHTML = Number.parseInt(likeCunt.innerHTML) + 1;
      } else {
        console.log('unlike post ' + postId);
        likeBtn.classList.remove('red-text');
        likeCunt.innerHTML = Number.parseInt(likeCunt.innerHTML) - 1;
      }
    });
}

// Single Post View

function getPostInfo() {
  let currentUrl = new URL(window.location.href);
  let postId = currentUrl.searchParams.get('id');

  fetch(api + 'post/' + postId, {
  })
    .then((response) => response.json())
    .then(data => {
      fetch(api + 'user/' + data['author_id'])
        .then((response_user) => response_user.json())
        .then(user_data => {

          fetch(api + 'post/likes/count/' + data['id'])
            .then((response) => response.json())
            .then(likeData => {
              fetch(api + 'post/is_liked/' + data['id'])
                .then((response) => response.json())
                .then(isLikedData => {
                  console.log(data);
                  let likes = likeData['count'];
                  let isLiked = isLikedData['like_state'];

                  let postPage = document.getElementById('post_page');
                  let likedClass = isLiked ? ' red-text' : '';
                  let likedImage = isLiked ? 'favorite' : 'favorite_border';
                  postPage.innerHTML += `  
      <div class="card darken-1">
        <div class="card-content">
          <span class="card-title"><h3>${data['title']}</h3></span>
        </div>
      </div>
      <div class="card darken-1">
        <div class="card-content">
          <p>${data['short_description']}</p>
        </div>
      </div>
      <audio style="padding: 10px; width: 100%;" controls="" src="api/audio/${data['audio_link']}" preload="none"></audio>
      <div class="card darken-1">
        <div class="card-content">
          <p>${data['long_description']}</p>
        </div>
      </div>
      <div class="card darken-1">
        <div class="card-content grey-text">
          <p>Author: <a href="profile.html?id=${data['author_id']}">${user_data['login']}</a></p>
          <div class="likes in-card"><span class="count-num" id="like_count${data['id']}">${likes}</span><span id="like_${data['id']}" onclick="likePost(${data['id']})" class="material-icons${likedClass}">${likedImage}</span></div>
        </div>
      </div>`

                  console.log(data['author_id'] + ' ' + getCookie('user_id'))

                  if (data['author_id'] == getCookie('user_id')) {
                    postPage.innerHTML += `
        <div class="row">
          <a class="btn-flat red-text waves-light" onclick="deletePost(${data['id']})">Delete post</a>
        </div>`
                  }

                  let comments = document.getElementById('post_page_comments');

                  fetch(api + 'post/comments/' + postId)
                    .then((response) => response.json())
                    .then(commentsList => {
                      commentsList.forEach(singleComment => {
                        fetch(api + 'user/' + singleComment['user_id'])
                          .then((response) => response.json())
                          .then(userData => {
                            comments.innerHTML += `
                      <div class="card darken-1">
                        <div class="card-content">
                          <h5>${userData['login']}</h5>
                          <p>${singleComment['comment_text']}</p>
                        </div>
                      </div>
                      `
                          })

                      })
                    });

                });
            });
        });
    })
    .catch((error) => {
      window.alert('Something went wrong! Try again later...');
    });
}

function deletePost(id) {
  fetch(api + 'post/' + id, {
    method: 'DELETE',
  })
    .then((request) => request.json())
    .then(res => {
      window.location.href = websiteUrl + '/index.html';
    })
}

function getProfileInfo() {
  let currentUrl = new URL(window.location.href);
  let profileId = currentUrl.searchParams.get('id');

  fetch(api + 'profile/' + profileId)
    .then((response) => response.json())
    .then(res => {
      let postsPage = document.getElementById('main_feed');
      let regDate = new Date(res['user']['registration_dt']);

      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      let fullRegDate = regDate.getDay() + ' ' + monthNames[regDate.getMonth()] + ' ' + regDate.getFullYear();
      postsPage.innerHTML = `
      <div class="card darken-1">
        <div class="card-content">
          <h3 class="center">${res['user']['login']}</h3>
        </div>
      </div>
      <div class="card darken-1">
        <div class="card-content">
          <p>Cakeday: ${fullRegDate}</p>
        </div>
      </div>
      <h5>${res['user']['login']} podcasts</h5>
    `
      let posts = res['user_posts'];
      posts.forEach((post) => {
        console.log(post)
        addPostPreview(post['post']['title'], post['post']['short_description'],
          post['author_login'], post['post']['author_id'], post['post']['id'], post['likes_count'], post['liked_by_user'], post['comments_count']);
      });
    });
}

// Add New Podcast

function addPost() {

  var url = new URL(api + 'post');

  const params = {
    title: document.getElementById('idea_title').value,
    short_description: document.getElementById('idea_short_desc').value,
    long_description: document.getElementById('idea_full_desc').value
  }

  let form_data = new FormData();
  form_data.append('file', current_audio_file);
  form_data.append('data', JSON.stringify(params));

  console.log("Sending " + current_audio_file);

  fetch(url, {
    method: 'POST',
    body: form_data,
    cache: 'no-cache',
  })
    .then(response => response.json())
    .then(data => {
      window.location.href = websiteUrl + '/post.html?id=' + data['post_id'];
    })
    .catch((error) => {
      window.alert('Something went wrong! Try again later...')
    });
}

// Add new comment

function addComment() {
  let currentUrl = new URL(window.location.href);
  let postId = currentUrl.searchParams.get('id');

  var url = new URL(api + 'post/comment/' + postId);

  const params = {
    comment_text: document.getElementById('idea_comment').value
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then(response => response.json())
    .then(data => {
      window.location.href = websiteUrl + '/post.html?id=' + postId;
    });
}

// Login

async function loginUser() {

  var url = new URL(api + 'login');

  const params = {
    login: document.getElementById('email').value,
    pwd_hash: document.getElementById('password').value
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then((response => response.json()))
    .then(data => {
      console.log("Got login info" + data)

      window.location.href = websiteUrl + '/index.html';
    })
    .catch(function () {
      alert('Wrong password and email comination!');
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    });
}

// Logout

function logoutUser() {
  window.localStorage.removeItem('user_id');
  window.localStorage.removeItem('user_email');
  window.location.href = websiteUrl + "/login.html";
  document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
}

// Register

function registerUser() {

  var url = new URL(api + 'register');

  const params = {
    login: document.getElementById('email').value,
    pwd_hash: document.getElementById('password').value
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Got register info" + data)

      window.location.href = websiteUrl + '/index.html';
    })

}

// Go To Page

function goToPage(pageEndpoint) {
  window.location.href = websiteUrl + pageEndpoint
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}



let footerContent = `
<div class="container">
      <div class="row">
        <div class="col l6 s12">
          <h5 class="white-text voi">Voi</h5>
          <p class="grey-text text-lighten-4">Voi mini-podcast service</p>

        </div>
        <div class="col l6 s12">
          <h5 class="white-text">Social Networks</h5>
          <ul>
            <li><a class="white-text" href="#!">Instagram</a></li>
            <li><a class="white-text" href="#!">Twitter</a></li>
            <li><a class="white-text" href="#!">YouTube</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="container">
        Made by Yarema Sergei and Mykita Oliinyk
      </div>
    </div>
  `

function fillContent() {
  let footer = document.getElementById("footer");
  footer.innerHTML = footerContent;
}

function defaultHeaderButtons() {
  fetch(api + 'user/' + id)
    .then(response => response.json())
    .then(result => {
      let login = result['login'];

      let navDesktop = document.getElementById('nav-desktop');
      let navMobile = document.getElementById('nav-mobile');

      navDesktop.innerHTML += `
            <li><a href="profile.html?id=${id}">${login}</a></li>
            <li><a href="${websiteUrl}/new-post.html">New Podcast</a></li>
            <li><a href="#" onclick="logoutUser()">Log Out</a></li>
            `
      navMobile.innerHTML += `
            <li><a href="profile.html?id=${id}">${login}</a></li>
            <li><a href="${websiteUrl}/new-post.html">New Podcast</a></li>
            <li><a href="#" onclick="logoutUser()">Log Out</a></li>
            `
    })
}


// Audio
function listenToAudioDrop() {
  let audioDrop = document.getElementById("audio-drop");
  let fileContent = document.getElementById("file-content");

  audioDrop.addEventListener("dragover", function (event) {
    event.preventDefault();
  }, false);

  audioDrop.addEventListener("drop", function (event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0]
    handleFile(file);
  }, false);

  audioDrop.addEventListener("click", () => {
    fileContent.click();
  });

  fileContent.addEventListener('change', () => {
    file = fileContent.files[0];
    handleFile(file);
  });
}

function handleFile(file) {
  const type = file.type.replace(/\/.+/, '')

  console.log("Filename: " + file.name);
  console.log("Type: " + file.type);
  console.log("Size: " + file.size + " bytes");

  if (type === "audio")
    createAudio(file);
  else
    alert("Please choose audio file");
}

const createAudio = audio => {
  const audioEl = document.createElement('audio')
  audioEl.setAttribute('controls', '')
  audioEl.src = URL.createObjectURL(audio)
  let audioDisplay = document.getElementById("audio-display");
  audioDisplay.innerHTML = "";
  audioDisplay.append(audioEl)
  // audioEl.play()
  // URL.revokeObjectURL(audio)
  current_audio_file = file;
}