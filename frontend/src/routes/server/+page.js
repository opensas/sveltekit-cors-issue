export async function load({ fetch }) {
	const response = await fetch('http://localhost:2020')
	return await response.json()
}