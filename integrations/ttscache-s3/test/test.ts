import { urlJoin } from 'url-join-ts';
 
const fullUrl = urlJoin('http://www.google.com', 'a', '/b/cd', '?foo=123');
 
console.log(fullUrl);