export function getCookie(name: string) {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find(row => row.startsWith(`${name}=`));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
}