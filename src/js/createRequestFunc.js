const createRequest = async (method, url, body = null) => {
    const headers = {
        'Content-Type': 'application/json;charset=utf-8',
    };
    let response;
    if (body) {
        response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(body),
        });
    } else {
        response = await fetch(url, {
            method: method,
            headers: headers,
        });
    }
    const result = await response.json();
    console.log(result);
    
    if (result) return result;

    return false;
}
export default createRequest;