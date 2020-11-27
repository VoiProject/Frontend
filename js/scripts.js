let api = 'http://35.222.187.209/api/'
let websiteUrl = window.location.origin
if (window.location.origin.startsWith('file'))
  websiteUrl = 'file:///C:/work/Voi/Frontend';
  api = 'http://127.0.0.1/api/';

function getFeed() {
  const id = window.localStorage.getItem('user_id');

  fetch(api + 'feed/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then(data => {
      let posts = data['user_feed'];
      posts.forEach((post)=>{
        addPostPreview(post['title'], post['short_description'], post['long_description'], post['id']);
      })
    });
}

function addPostPreview(title, shortDescription, author, postId) {
  let feed = document.getElementById('main_feed');

  newPost = '<div class="card darken-1">\n\t<div class="card-content">\n';
  newPost += '\t\t<span class="card-title">' + title + '</span>\n';
  newPost += '\t\t<p>' + shortDescription + '</p>\n';
  newPost += '\t</div>\n\t<div class="card-action">\n';
  newPost += '\t\t<a href="' + websiteUrl + 'post.html?id=' + postId + '">READ FULL</a>\n';
  newPost += '\t\t<span class="grey-text">' + author + '</span>\n';
  newPost += '\t</div>\n</div>\n\n';

  feed.innerHTML += newPost;
}

// Single Post View

function getPostInfo() {
  let currentUrl = new URL(window.location.href);
  let postId = currentUrl.searchParams.get('id');

  fetch(api + 'post/' + postId, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then(data => {

      fetch(api + 'user/' + data['author_id'])
        .then((response_user) => response_user.json())
        .then(user_data => {
          let postPage = document.getElementById('post_page');

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
      <div class="card darken-1">
        <div class="card-content">
          <p>${data['full_description']}</p>
        </div>
      </div>
      <div class="card darken-1">
        <div class="card-content grey-text">
          <p>Author: ${user_data['login']}</p>
        </div>
      </div>`
        });
    })
    .catch((error) => {
      window.alert('Something went wrong! Try again later...');
    });
}

// Add new Post

function addPost() {

  var url = new URL(api + 'post');

  const params = {
    author_id: window.localStorage.getItem('user_id'),
    title: document.getElementById('idea_title').value,
    short_description: document.getElementById('idea_short_desc').value,
    long_description: document.getElementById('idea_full_desc').value
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => { })
    .catch((error) => {
      window.alert('Something went wrong! Try again later...')
    });
}

// Login

async function loginUser() {

  var url = new URL(api + 'login');

  const params = {
    login: document.getElementById('email').value,
    pwd_hash: document.getElementById('password').value
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: 'POST',
  })
    .then(response => {
      print(response);
      response.json();
    })
    .then(data => {
      console.log(data);
      window.localStorage.setItem('user_id', data['id']);

      window.location.href = websiteUrl + 'index.html';
    })

}

// Logout

function logoutUser() {
  window.localStorage.removeItem('user_id');
  window.localStorage.removeItem('user_email');
  window.location.href = websiteUrl+"/login.html";
}

// Register

function registerUser() {

  var url = new URL(api + 'register');

  const params = {
    login: document.getElementById('email').value,
    pwd_hash: document.getElementById('password').value
  }

  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  fetch(url, {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.localStorage.setItem('user_id', data['id']);

      window.location.href = websiteUrl + 'index.html';
    })

}

// Go To Page

function goToPage(pageEndpoint) {
  window.location.href = websiteUrl + pageEndpoint
}
