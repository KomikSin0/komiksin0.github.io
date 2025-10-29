VK.init({
    apiId: 54278842
});
function auth() {
    VK.Auth.login(function(response) {
        if (response.session) {
            getUserInfo();
            document.getElementById('login-btn').style.display = 'none';
        }
    }, VK.access.FRIENDS);
}
function getUserInfo() {
    VK.Api.call('users.get', {fields: 'photo_200, city, country, sex, bdate'}, function(response) {
        if (response.response) {
            const user = response.response[0];
            document.getElementById('user-info').innerHTML = `
                <img src="${user.photo_200}" style="border-radius: 50%; width: 100px; height: 100px; margin-bottom: 15px;">
                <h2>${user.first_name} ${user.last_name}</h2>
                <p>📍 Город: ${user.city ? user.city.title : 'Не указан'}</p>
                <p>🎂 День рождения: ${user.bdate || 'Не указан'}</p>
                <p>👤 Пол: ${user.sex === 1 ? 'Женский' : user.sex === 2 ? 'Мужской' : 'Не указан'}</p>
            `;
        }
    });
}
function getFriends() {
    VK.Api.call('friends.get', {fields: 'photo_100, city'}, function(response) {
        if (response.response) {
            const friends = response.response.items.slice(0, 8);
            let html = '<h3>🎯 Ваши друзья:</h3><div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">';
            friends.forEach(friend => {
                html += `
                    <div style="text-align: center; min-width: 80px;">
                        <img src="${friend.photo_100}" style="border-radius: 50%; width: 60px; height: 60px; object-fit: cover;">
                        <p style="margin: 5px 0; font-size: 12px;">${friend.first_name}</p>
                    </div>
                `;
            });
            html += '</div>';
            document.getElementById('friends-list').innerHTML = html;
        }
    });
}
function getPhotos() {
    VK.Api.call('photos.get', {album_id: 'profile', count: 6}, function(response) {
        if (response.response) {
            const photos = response.response.items;
            let html = '<h3>📸 Ваши фотографии:</h3><div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">';
            photos.forEach(photo => {
                html += `
                    <img src="${photo.sizes[3].url || photo.sizes[2].url}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">
                `;
            });
            html += '</div>';
            document.getElementById('photos-list').innerHTML = html;
        }
    });
}
window.onload = function() {
    VK.Auth.getLoginStatus(function(response) {
        if (response.session) {
            getUserInfo();
            document.getElementById('login-btn').style.display = 'none';
        } else {
            document.getElementById('user-info').innerHTML = 
                '<p>Для работы приложения необходимо авторизоваться</p>';
        }
    });
};
