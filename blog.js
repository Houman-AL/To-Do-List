

let url_api = "https://jsonplaceholder.typicode.com/posts";

let AllPosts = [];
let CurrentPage = 1;;


function RenderPosts(){
    let element = document.getElementById("postsContainer");
    element.innerHTML = '';
    
    AllPosts.forEach(p => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <h2 class="post-title">${p.title}</h2>
            <p class="post-body">${p.body}</p>
            <div class="UserId">User Id: ${p.userId}</div>
            <div class="UserId">Post Id: ${p.id}</div>
        `;
        element.appendChild(div);
    });
}

async function RefreshPosts(){
  try {
    const r = await fetch(url_api);
    
    if (!r.ok) {
      throw new Error('Network Response Is Bad');
    }
    
    AllPosts = await r.json();
    RenderPosts();

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



RefreshPosts();

