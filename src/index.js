// Please run your solution from this file

async function getValues() {
	const res = await fetch("https://api.spacexdata.com/v3/launches/past");
	const data = await res.json();
	const values = data
		.filter(x =>
			x.launch_year === "2018" &&
			x.rocket.second_stage.payloads.some(payload => payload.customers.some(customer => customer.includes("NASA")))
		)
		.map(x => {
			const {
				flight_number,
				mission_name,
				rocket: { second_stage },
				launch_date_utc
			} = x;

			return {
				flight_number,
				mission_name,
				payloads_count: second_stage.payloads.length,
				launch_date_utc
			};
		})
		.sort((a, b) => new Date(a.launch_date_utc).getTime() < new Date(b.launch_date_utc).getTime() ? -1 : 1)
  	.sort((a, b) => a.payloads_count > b.payloads_count ? -1 : 1)
  	.map(({ launch_date_utc, ...rest }) => rest);

	return values;
}

(async function() {
	const values = await getValues();
	document.getElementById("out").innerHTML = JSON.stringify(values, null, 2);
})();

console.log("Hello from %csrc/index.js", "font-weight:bold");
