// "use server"

// import { z } from "zod"

// const formSchema = z.object({
//   name: z.string().min(2),
//   email: z.string().email(),
//   subject: z.string().min(5),
//   message: z.string().min(10),
// })

// export async function submitContactForm(formData: FormData) {
//   try {
//     // Extract and validate form data
//     const data = {
//       name: formData.get("name") as string,
//       email: formData.get("email") as string,
//       subject: formData.get("subject") as string,
//       message: formData.get("message") as string,
//     }

//     const validatedData = formSchema.parse(data)

//     // In a real implementation, you would:
//     // 1. Send an email notification
//     // 2. Store the message in a database
//     // 3. Potentially trigger other workflows

//     console.log("Contact form submission:", validatedData)

//     // Simulate processing time
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     return { success: true, message: "Message sent successfully!" }
//   } catch (error) {
//     console.error("Contact form error:", error)
//     return { success: false, message: "Failed to send message. Please try again." }
//   }
// }
