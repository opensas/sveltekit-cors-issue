<script>
	let data = {}
	const load = async () => {
		const response = await fetch('http://localhost:2020')
		data = await response.json()
	}
	load()
</script>

<p>Go back <a href="/">home</a></p>

<hr />

<textarea cols="40" rows="10">{JSON.stringify(data, null, 2)}</textarea>