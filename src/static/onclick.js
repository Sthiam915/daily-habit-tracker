export function log_out(){
    document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    fetch('/login')
    .then(response => window.location.href = response.url);
}