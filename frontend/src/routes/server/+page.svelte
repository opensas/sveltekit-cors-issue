<script>
	export let data

	console.log({data})
</script>

<p>Go back <a href="/">home</a></p>

<p>Refresh browser to fetch from server!!!</p>

<hr />
	
<textarea cols="40" rows="10">{JSON.stringify(data, null, 2)}</textarea>