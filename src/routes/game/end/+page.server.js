import { redirect } from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({url}) {
    if(!url.searchParams.get("gameStats") || !url.searchParams.get("username")){
        throw redirect(307, `/`)
        throw fail(400, {error:true, message:"Didn't play game"})
    }
    const user = url.searchParams.get("username");
    const encodedStats = url.searchParams.get("gameStats");
    const decodedStats = decodeURIComponent(encodedStats);
    const statsObject = JSON.parse(decodedStats);

    return {statsObject, user};
};