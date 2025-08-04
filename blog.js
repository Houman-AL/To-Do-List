

let url_api = "https://jsonplaceholder.typicode.com/posts";

let AllPosts = [];
let CurrentPage = 1;;


function RenderPosts(){
    
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

