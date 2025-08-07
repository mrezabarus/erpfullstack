import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage(){
  const cookieStore = await cookies();
  const token = cookieStore.getAll();

  if(!token){
    redirect('/login');
  }

  redirect('/home');
}