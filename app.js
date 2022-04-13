// Global variables
const baseUrl = 'https://jsonplaceholder.typicode.com';
const userFields = ['name', 'username', 'email'];

// Functions
function getUsers() {
	fetch(`${baseUrl}/users/`)
		.then((res) => res.json())
		.then((users) => displayUsers(users));
}

function getPosts(ev) {
	ev.preventDefault();
    // Get user ID from dataset
	const userId = ev.target.parentElement.dataset.userId;
    // Fetch user info (implemented this way to keep the function independent)
	fetch(`${baseUrl}/users/?id=${userId}`)
		.then((res) => res.json())
		.then((user) => {
			const currentUser = user[0];
            // Fetch user posts
			fetch(`${baseUrl}/posts/?userId=${currentUser.id}`)
				.then((res) => res.json())
				.then((posts) => displayPosts(posts, currentUser));
		});
}

function displayUsers(users) {
	const tableBody = document.getElementById('users-table-body');
	tableBody.addEventListener('click', getPosts);
	users.forEach((user) => {
        // Create row for each user
		const row = document.createElement('tr');
		row.classList.add('users-table-row');
        // add row columns
		userFields.forEach((field) => {
			const col = document.createElement('td');
			col.innerText = user[field];
			row.appendChild(col);
		});
        // Store user ID for fetching user posts
		row.dataset.userId = user.id;
		tableBody.appendChild(row);
	});
}

function displayPosts(posts, user) {
	if (document.querySelector('.posts-background')) {
		document.querySelector('.posts-background').remove();
	}
    const postsBG = document.createElement('div');
    postsBG.classList.add('posts-background')
	const postsCont = document.createElement('div');
	postsCont.classList.add('posts-list-container');
    // Title for the post list
	const title = document.createElement('h2');
    title.classList.add('posts-list-title');
    title.innerHTML = `${user.name}'s Posts`;
    // Button to close the post list
	const closeBtn = document.createElement('button');
	closeBtn.classList.add('posts-list-close');
	closeBtn.innerText = 'Close';
	closeBtn.addEventListener('click', () =>
		document.querySelector('.posts-background').remove()
	);
    // Instructions how to open/close posts body
	const inst = document.createElement('p');
	inst.classList.add('instructions');
	inst.innerHTML = 'Click on post title to open/close';
	postsCont.appendChild(title);
	postsCont.appendChild(closeBtn);
	postsCont.appendChild(inst);
	const postList = document.createElement('ul');
	posts.forEach((post) => {
		const postItem = document.createElement('li');
        // Post title
		const postTitle = document.createElement('h3');
        // Post body
		const postContent = document.createElement('p');
		postTitle.classList.add('post-title');
		postTitle.innerHTML = post.title;
        // Open/Close post body
		postTitle.addEventListener('click', (ev) => {
			postContent.classList.toggle('hidden');
		});
		postContent.innerHTML = post.body;
        // Post body initially hidden (closed)
		postContent.classList.add('post-content', 'hidden');
		postItem.appendChild(postTitle);
		postItem.appendChild(postContent);
		postList.appendChild(postItem);
	});
	postsCont.appendChild(postList);
	postsBG.appendChild(postsCont);
	document.body.appendChild(postsBG);
}

// Get users data
getUsers();
