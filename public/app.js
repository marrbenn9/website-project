fetch('/users')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('userList');
    data.forEach(user => {
      const item = document.createElement('li');
      item.textContent = `${user.name} (${user.email})`;
      list.appendChild(item);
    });
  })
  .catch(err => console.error('Error fetching users:', err));
