import neoAxios from '@/lib/neoAxios';

export async function getRoles() {
	const res = await neoAxios('/users/getRoles');
	return res.data;
}

export async function getUsers() {
	const res = await neoAxios('/users/getUsers');
	return res.data;
}

export async function getPermissions(){
	const res = await neoAxios('/users/getPermissions');
	return res.data;
}