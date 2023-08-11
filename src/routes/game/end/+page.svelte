<script>
    /** @type {import('./$types').PageData} */
    export let data;
    
    const stats = data.statsObject
    
    let csvContent = "Round,Hits\n";

    for (let key in stats) {
        const arrayValues = stats[key];
        const csvLine = `${key},"${arrayValues.join(",")}"\n`;
        csvContent += csvLine;
    }
    const blob = new Blob([csvContent], { type: "text/csv" });

</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-white text-5xl my-3 font-bold">Game Finished</h1>
    <a href="{URL.createObjectURL(blob)}" download="{data.user}.csv" class="text-white underline">Download csv file with your game results</a>
    <div class="my-5">
        <a href="/" class="text-white capitalize underline">Go back to main page</a>
    </div>
</div>