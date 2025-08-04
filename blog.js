

let url_api = "https://jsonplaceholder.typicode.com/posts";

async function RefreshPosts(){
  try {
    const r = await fetch(url_api);
    
    if (!r.ok) {
      throw new Error('Network Response Is Bad');
    }
    
    const data = await r.json();

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

