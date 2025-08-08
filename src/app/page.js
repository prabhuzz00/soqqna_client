import Home from "@/components/Home";
import { fetchDataFromApi } from "@/utils/api";

export default async function Page() {
  "use server";

  return <Home />;
}
