Sample repo to reproduce SvelteKit but with CORS headers

Steps to reproduce:

1. create the api project

```
mkdir issue
cd issue

mkdir api

npm init -y

npm i express cors
```

Create index.js file:

```
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: true }))

app.get('/', (req, res) => (res.json({ message: 'Hello World' })))

app.listen(2020, () => (console.log('server is listening on port 2020')))
```

Run server

```
$ node index.js 
server is listening on port 2020
```

Test server *without* sending the `Origin` header

```
$ curl -vs localhost:2020

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Vary: Origin
< Content-Type: application/json; charset=utf-8
< Content-Length: 25
< ETag: W/"19-c6Hfa5VVP+Ghysj+6y9cPi5QQbk"
< Date: Wed, 21 Sep 2022 17:56:28 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
{"message":"Hello World"}
```

Test server sending the `Origin` header

```
$ curl -vs localhost:2020 --header 'origin: http://localhost:2000'
> GET / HTTP/1.1
> Host: localhost:2020
> User-Agent: curl/7.58.0
> Accept: */*
> origin: http://localhost:2000
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: http://localhost:2000
< Vary: Origin
< Content-Type: application/json; charset=utf-8
< Content-Length: 25
< ETag: W/"19-c6Hfa5VVP+Ghysj+6y9cPi5QQbk"
< Date: Wed, 21 Sep 2022 17:57:20 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
{"message":"Hello World"}
```

Notice the `Access-Control-Allow-Origin: http://localhost:2000` response header

2. create the frontend project

```
$ npm create svelte@latest frontend

✔ Which Svelte app template? › Skeleton project
✔ Add type checking with TypeScript? › No
✔ Add ESLint for code linting? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
✔ Add Playwright for browser testing? … No / Yes

$ cd frontend

$ npm install

npm run dev

  VITE v3.1.3  ready in 411 ms
  ➜  Local:   http://localhost:5173/
```

Add /src/routes/+page.js file

```
export async function load({ fetch }) {
	const response = await fetch('http://localhost:2020')
	return await response.json()
}
```

Update /src/routes/+page.svelte

```
<script>
	export let data
	console.log({data})
</script>

<textarea cols="40" rows="10">{JSON.stringify(data, null, 2)}</textarea>
```

3. See error:

```
CORS error: No 'Access-Control-Allow-Origin' header is present on the requested resource
Error: CORS error: No 'Access-Control-Allow-Origin' header is present on the requested resource
    at fetch (file:///home/sas/devel/apps/glas-it/apps/wingback/tmp/migration/issue/frontend/node_modules/@sveltejs/kit/src/runtime/server/page/fetch.js:102:15)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async fetcher (file:///home/sas/devel/apps/glas-it/apps/wingback/tmp/migration/issue/frontend/node_modules/@sveltejs/kit/src/runtime/server/page/fetch.js:63:20)
    at async load (/src/routes/server/+page.js:2:19)
    at async load_data (file:///home/sas/devel/apps/glas-it/apps/wingback/tmp/migration/issue/frontend/node_modules/@sveltejs/kit/src/runtime/server/page/load_data.js:109:15)
    at async file:///home/sas/devel/apps/glas-it/apps/wingback/tmp/migration/issue/frontend/node_modules/@sveltejs/kit/src/runtime/server/page/index.js:170:13
```

Note: the error can be solved adding `request.headers.set('Origin', event.url.origin);` to `@sveltejs/kit/src/runtime/server/page/fetch.js` (see [here](https://github.com/sveltejs/kit/blob/1a2459fa683638c8914626ff11bb4f736b45b6ff/packages/kit/src/runtime/server/page/fetch.js#L88))

```
						const cookie = get_cookie_header(url, request.headers.get('cookie'));
						if (cookie) request.headers.set('cookie', cookie);
					}

					// #FIX: add this line
					request.headers.set('Origin', event.url.origin);

					let response = await fetch(request);

					if (request.mode === 'no-cors') {
						response = new Response('', {
```