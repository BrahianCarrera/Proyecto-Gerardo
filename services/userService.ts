import { api } from './api'



export async function registerUser(userPayload:any) {
  return await api.post("/users/register", userPayload )
  
}


export async function getUserInfo(userId: string){
  return await api.get(`/users?id=${userId}`)
}

export const updatePhoto = async (uri: string, userId: string) => {
  const formData = new FormData();

  formData.append('userId', userId);
  formData.append('picture', {
    uri,
    name: `profile_${userId}.jpg`,
    type: 'image/jpeg',
  } as any);

  const response = await fetch('http://192.168.0.18:4000/users', {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error en la respuesta del servidor');
  }

  return response.json();
};

export async function registerSpecialist(userPayload:any) {
  return await api.post("/users/register/specialist", userPayload )
  
}