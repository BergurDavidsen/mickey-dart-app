import { redirect } from "@sveltejs/kit";
import {fail} from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export const load = ({ url }) => {
    return {}
}

export const actions = {
    join: async({request, url}) => {
        const data = await request.formData();
        const room = data.get("room")
        const user = data.get("user")
        
        if(!room || !user){
            return fail(400, {error:true, message:"Room pin  or username missing"})
        }
        
        throw redirect(303, `/game/mickey?room=${room}&username=${user}`);
    },

    create: async({request,url}) => {
        const data = await request.formData();
        const room = data.get("room")
        const user = data.get("user")
        if(!room || !user){
            return fail(400, {error:true, message:"Room pin  or username missing"})
        }
        
        throw redirect(303, `/game/mickey?room=${room}&username=${user}`)
    }

}
