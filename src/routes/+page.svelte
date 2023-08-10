<script>
	let username = '';
	let joiningRoom = false;
	let creatingRoom = false;

	export let form;

	function handleCreate() {
		creatingRoom = true;
		joiningRoom = false;
	}
	function handleJoin() {
		joiningRoom = true;
		creatingRoom = false;
	}
</script>

<div
	class="bg-black w-screen flex flex-col justify-center items-center text-white text-center mt-5"
>
	<h1
		class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
	>
		Welcome to Mickey (The Dart Game)
	</h1>
	<p class="mt-3">
		Your aim is to close out the numbers from twelve to twenty, along with three doubles, triples,
		and the bullseye. Players take turns throwing three darts each. Close out a number by hitting it
		three times. Hits don't have to be in the same round.
	</p>
	{#if form?.error}
		<p class="text-red-500 mt-3">{form.message}!</p>
	{/if}
</div>
<div class="w-screen bg-black flex flex-col justify-center items-center text-white mt-10">
	{#if joiningRoom}
		<div class="bg-white text-black rounded-xl">
			<form
				action="?/join"
				method="POST"
				class="flex flex-col justify-center items-center border p-5 rounded-xl shadow-2xl"
			>
				<p>Choose a username and enter room pin to join</p>
				<label class="m-2" for="room">Username</label>
				<input
					class="m-2 p-2 border-black border rounded-md shadow-md"
					type="text"
					name="user"
					bind:value={username}
				/>
				<label class="m-2" for="room">Room Pin</label>
				<input class="m-2 p-2 border-black border rounded-md shadow-md" type="text" name="room" />
				<button
					class="m-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
					type="submit">Join Room</button
				>
			</form>
			<button class="ml-2 hover:underline text-md" on:click={() => (joiningRoom = false)}
				>Close</button
			>
		</div>
	{/if}
	{#if creatingRoom}
		<div class="bg-white text-black rounded-xl">
			<form
				action="?/create"
				method="POST"
				class="flex flex-col justify-center items-center border p-5 rounded-xl shadow-2xl"
			>
				<p class="m-2">Type in your wanted username and room pin to create room</p>
				<label for="user">Username</label>
				<input
					class="m-2 p-2 border-black border rounded-md shadow-md"
					type="text"
					name="user"
					bind:value={username}
				/>
				<label class="m-2" for="room">Room Pin</label>
				<input class="m-2 p-2 border-black border rounded-md shadow-md" type="text" name="room" />
				<button
					class="m-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
					type="submit">Create Room</button
				>
			</form>
			<button class="ml-2 hover:underline text-md" on:click={() => (creatingRoom = false)}
				>Close</button
			>
		</div>
	{/if}
	{#if !creatingRoom && !joiningRoom}
		<button
			class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			on:click={() => handleCreate()}>Create Room</button
		>
		<button
			class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
			on:click={() => handleJoin()}>Join Room</button
		>
	{/if}
</div>
<!-- <div class="h-full w-full max-w-md mx-auto bg-zinc-500 flex flex-col">
		<header
			class="px-6 py-4 border-b border-zinc-800 bg-zinc-700 text-white shrink-0 flex items-center justify-between"
		>
			<span class="font-bold text-xl">My Chat app</span>
			<span>{username}</span>
		</header>

		<div class="h-full w-full p-4">
			{#each messages as message}
				<div class="bg-zinc-300 rounded-xl rounded-tl-none px-4 py-3 my-4 w-fit">
					<span class="flex items-center space-between gap-4">
						<b>{message.from}</b>
						<i>{message.time}</i>
					</span>
					{message.message}
				</div>
			{/each}
		</div>

		<form
			action="#"
			on:submit|preventDefault={sendMessage}
			class="px-6 py-4 border-t border-zinc-800 bg-zinc-700 text-white shrink-0 flex items-center"
		>
			<input
				type="text"
				bind:value={textfield}
				placeholder="Type something..."
				class="bg-transparent border-none px-4 py-3 w-full"
			/>
			<button type="submit" class="shrink-0 border border-white rounded-lg px-4 py-3">Send</button>
		</form>
	</div>
</div> -->
