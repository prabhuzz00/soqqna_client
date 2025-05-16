import { firebaseApp } from "@/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export async function POST(request) {
  try {
    const firestore = getFirestore(firebaseApp);
    const { userId, address } = await request.json();

    if (!userId || !address) {
      return new Response(JSON.stringify({ message: "User ID and address are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save the address to Firestore in a 'users' collection
    await setDoc(doc(firestore, "users", userId), {
      address: address,
    }, { merge: true }); // Use merge: true to avoid overwriting other user data

    return new Response(JSON.stringify({ message: "Address saved successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving address:", error);
    return new Response(JSON.stringify({ message: "Error saving address", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
