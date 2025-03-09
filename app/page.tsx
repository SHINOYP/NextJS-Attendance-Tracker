import { getServerSession } from "next-auth";


export default async function Home() {
  const data = await getServerSession();
  console.log(data);
  return (
    <main>{JSON.stringify(data)}</main>
  );
}
