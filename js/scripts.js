let api = window.location.origin + '/api/'
let websiteUrl = window.location.origin

function getFeed() {
  const id = getCookie('user_id');

  fetch(api + 'feed/' + id, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then((response) => response.json())
    .then(data => {
      let posts = data['user_feed'];
      posts.forEach((post) => {
        addPostPreview(post['title'], post['short_description'], post['author_id'], post['id']);
      })
    });
}

function addPostPreview(title, shortDescription, author, postId) {
  let feed = document.getElementById('main_feed');

  newPost = '<div class="card darken-1">\n\t<div class="card-content">\n';
  newPost += '\t\t<span class="card-title">' + title + '</span>\n';
  newPost += '\t\t<p>' + shortDescription + '</p>\n';
  newPost += '\t</div>\n\t<div class="card-action">\n';
  newPost += '\t\t<a href="' + websiteUrl + '/post.html?id=' + postId + '">READ FULL</a>\n';
  newPost += '\t\t<span class="grey-text">' + author + '</span>\n';
  newPost += '\t</div>\n</div>\n\n';

  feed.innerHTML += newPost;
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
          <p>${data['long_description']}</p>
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
    title: document.getElementById('idea_title').value,
    short_description: document.getElementById('idea_short_desc').value,
    long_description: document.getElementById('idea_full_desc').value
  }

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then(response => response.json())
    .then(data => {
      window.location.href = websiteUrl + '/post.html?id=' + data['post_id'];
    })
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

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then((response => response.json()))
    .then(data => {
      console.log("Got login info" + data)

      window.location.href = websiteUrl + '/index.html';
    })
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
  Made by  Yarema Sergei and Mykyta Oliinyk
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
            <li>${login}</li>
            <li><a href="${websiteUrl}/new-post.html">New Post</a></li>
            <li><a href="#" onclick="logoutUser()">Log Out</a></li>
            `
      navMobile.innerHTML += `
            <li>${login}</li>
            <li><a href="${websiteUrl}/new-post.html">New Post</a></li>
            <li><a href="#" onclick="logoutUser()">Log Out</a></li>
            `
    })
}