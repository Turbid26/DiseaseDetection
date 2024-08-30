function searchBlog() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const blogPosts = document.getElementsByClassName('post');

    for (let i = 0; i < blogPosts.length; i++) {
        const postTitle = blogPosts[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
        const postContent = blogPosts[i].getElementsByTagName('p')[0].innerText.toLowerCase();

        if (postTitle.includes(input) || postContent.includes(input)) {
            blogPosts[i].style.display = 'block';
        } else {
            blogPosts[i].style.display = 'none';
        }
    }
}
