export async function load({ fetch }) {
	const response = await fetch('http://localhost:2020')
	const message = await response.json()
	return message
}