import ioClient from 'socket.io-client';
import { env } from '$env/dynamic/public'
const ENDPOINT = env.URL;

const socket = ioClient(ENDPOINT);

export const io = socket;
