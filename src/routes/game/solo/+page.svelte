<script>
	import { io } from '$lib/webSocketConnection.js';
	import { onMount } from 'svelte';

	/** @type {import('./$types').PageServerLoad} */
	export let data;

	let playerList = [];
	let winners = [];
	let turn;
	let starter = 0;

	let hits = {
		Double: 0,
		Triple: 0,
		Bull: 0,
		'20': 0,
		'19': 0,
		'18': 0,
		'17': 0,
		'16': 0,
		'15': 0,
		'14': 0,
		'13': 0,
		'12': 0
	};

	onMount(() => {
		io.emit('join-room', data.room, data.user);

		io.on('button-clicked-return', (room, user, key) => {
			for (let i = 0; i < playerList.length; i++) {
				if (playerList[i].name === user) {
					playerList[i].score += 1;
				}
			}
		});
		io.on('reduce-score', (room, user, key) => {
			for (let i = 0; i < playerList.length; i++) {
				if (playerList[i].name === user) {
					playerList[i].score -= 1;
				}
			}
		});

		io.on('remove-key', (room, user, key) => {
			for (let i = 0; i < playerList.length; i++) {
				if (playerList[i].name == user) {
					for (let index = 0; index < playerList[i].unfinishedHits.length; index++) {
						if (playerList[i].unfinishedHits[index] === key) {
							playerList[i].unfinishedHits.splice(index, 1);
							playerList[i].score = playerList[i].score;
							break;
						}
					}
				}
			}
		});
		io.on('re-enter-key', (room, user, key) => {
			for (let i = 0; i < playerList.length; i++) {
				if (playerList[i].name === user) {
					playerList[i].unfinishedHits.push(key);
					playerList[i].score = playerList[i].score;
				}
			}
		});

		io.on('people-in-room', (players) => {
			playerList = players.map((player) => ({
				name: player,
				score: 0,
				unfinishedHits: Object.keys(hits).filter((key) => hits[key] < 3)
			}));
			turn = playerList[starter].name;
		});

		io.on('show-winner', (name) => {
			winners.push(name);
		});
		io.on('turn-passed', (room, user) => {
			starter = (starter + 1) % playerList.length;
			turn = playerList[starter].name;
			if (starter == 0) {
				round++;
			}
		});
		io.on('remove-player', (name) => {
			playerList = playerList.filter((item) => item.name !== name);
		});
	});

	const finished = 'Done!';

	let round = 1;

	let isWinner = false;

	function passTurn() {
		io.emit('pass-turn', data.room, data.user);
	}

	function handleClick(key) {
		if (data.user == turn) {
			if (hits[key] != finished) {
				hits[key] = hits[key] + 1;
				io.emit('button-clicked', data.room, data.user, key);
			}
			if (hits[key] == 3) {
				hits[key] = finished;
				isWinner = checkIfWinner();
				io.emit('finished-hit', data.room, data.user, key);
			}
		}
	}

	function undo(key) {
		if (data.user == playerList[starter].name) {
			if (hits[key] > 0 || hits[key] == finished) {
				io.emit('undo-button-click', data.room, data.user, key);
			}
			if (hits[key] > 0) {
				hits[key] -= 1;
			}

			if (hits[key] == finished) {
				hits[key] = 2;
				isWinner = checkIfWinner();
				io.emit('undo-key-removal', data.room, data.user, key);
			}
		}
	}

	function checkIfWinner() {
		let values = Object.values(hits);

		for (let index = 0; index < values.length; index++) {
			if (values[index] != finished) {
				return false;
			}
		}
		io.emit('winner-found', data.user, data.room);
		return true;
	}
</script>

<div class="text-white">
	<h2 class="font-bold text-sm">Room Pin: {data.room}</h2>
	<h2 class="font-bold">Your Name: {data.user}</h2>
	<table class="border border-black text-black">
		<tr>
			<th class="border border-black bg-green-400">Name</th>
			<th class="border border-black bg-green-400">Score</th>
			<th class="border border-black bg-green-400">Still Needs To Hit</th>
		</tr>
		{#each playerList as player}
			{#if winners.includes(player.name)}
				<tr>
					<td class="border border-black bg-amber-100">{player.name} Is Done</td>
					<td class="border border-black bg-amber-100">{player.score}/36</td>
					<td class="border border-black bg-amber-100">{player.unfinishedHits}</td>
				</tr>
			{:else}
				<tr>
					<td class="border border-black bg-amber-100">{player.name}</td>
					<td class="border border-black bg-amber-100">{player.score}/36</td>
					<td class="border border-black bg-amber-100">{player.unfinishedHits}</td>
				</tr>
			{/if}
		{/each}
	</table>
</div>
<div class="flex flex-col justify-center items-center h-screen text-center text-white">
	{#if isWinner}
		<h1 class="font-bold text-md">YOU WON! It Took You {round} Rounds!</h1>
		<h2>It's {data.user == turn ? 'Your' : turn + "'s"} Turn</h2>
	{:else}
		<h1 class="font-bold text-md">GAME ONGOING</h1>
		<h2>It's {data.user == turn ? 'Your' : turn + "'s"} Turn</h2>
		<p>Round: {round}</p>
	{/if}

	<div>
		<button
			class=" mb-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
			on:click={() => passTurn()}>{turn ? 'Pass Turn' : 'Start Game'}</button
		>
	</div>

	{#each Object.keys(hits) as key}
		<div>
			<button
				on:click={() => handleClick(key)}
				name={key}
				class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>{key}</button
			>
			<label class="m-1" for={key}>{hits[key]}</label>
			<button
				on:click={() => undo(key)}
				class="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			>
				undo
			</button>
		</div>
	{/each}
</div>
