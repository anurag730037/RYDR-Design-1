export const apiClient = (url, method, headers, body) => {
    fetch(url, {
        method,
        headers: {
            ...headers,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            // "key": `${localStorage.getItem('key')}`,
            'Content-Type': "application/json",
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.status === 401) {
                console.log('LOCAL STORAGE CLEARED')
                // localStorage.clear()
            }
        });
}
