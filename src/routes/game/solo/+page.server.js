import { redirect } from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export const load = ({ url }) => {
    if(!url.searchParams.get("room")){
        throw redirect(307, `/`)
        throw fail(400, {error:true, message:"no room pin"})
    }
    if(!url.searchParams.get("username")){
        throw redirect(307, `/`)
        throw fail(400, {error:true, message:"no username"})
    }
    let room = url.searchParams.get("room");
    let user = url.searchParams.get("username");

    return {room, user};
    
}

export const actions = {
    endGame: async({request,url}) => {
        const gameData = await request.formData();
        const user = gameData.get("username");
        const stats = gameData.get("stats");

        throw redirect(303, `/game/end?gameStats=${stats}&username=${user}`);
    }

}

