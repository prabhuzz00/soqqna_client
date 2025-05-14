// "use client"

// import { useState, type FormEvent, type ChangeEvent } from "react"

// type FormData = {
//   name: string
//   email: string
//   subject: string
//   message: string
// }

// type FormErrors = {
//   name?: string
//   email?: string
//   subject?: string
//   message?: string
// }

// export default function ContactForm() {
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   })

//   const [errors, setErrors] = useState<FormErrors>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitted, setSubmitted] = useState(false)

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))

//     // Clear error when user types
//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined }))
//     }
//   }

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {}

//     if (!formData.name || formData.name.length < 2) {
//       newErrors.name = "Name must be at least 2 characters."
//     }

//     if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address."
//     }

//     if (!formData.subject || formData.subject.length < 5) {
//       newErrors.subject = "Subject must be at least 5 characters."
//     }

//     if (!formData.message || formData.message.length < 10) {
//       newErrors.message = "Message must be at least 10 characters."
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()

//     if (!validateForm()) return

//     setIsSubmitting(true)
//     setSubmitted(false)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500))

//     console.log(formData)
//     setIsSubmitting(false)
//     setSubmitted(true)

//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     })
//   }

//   return (
//     <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//       <div>
//         <label htmlFor="name">Name</label>
//         <input
//           id="name"
//           name="name"
//           placeholder="Your name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
//       </div>

//       <div>
//         <label htmlFor="email">Email</label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           placeholder="Your email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
//       </div>

//       <div>
//         <label htmlFor="subject">Subject</label>
//         <input
//           id="subject"
//           name="subject"
//           placeholder="What is this regarding?"
//           value={formData.subject}
//           onChange={handleChange}
//         />
//         {errors.subject && <p style={{ color: "red" }}>{errors.subject}</p>}
//       </div>

//       <div>
//         <label htmlFor="message">Message</label>
//         <textarea
//           id="message"
//           name="message"
//           placeholder="How can we help you?"
//           rows={5}
//           value={formData.message}
//           onChange={handleChange}
//         />
//         <p style={{ fontSize: "0.85rem", color: "#666" }}>Please provide as much detail as possible.</p>
//         {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}
//       </div>

//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Sending..." : "Send Message"}
//       </button>

//       {submitted && (
//         <p style={{ color: "green", fontWeight: "bold" }}>
//           Message Sent. Thank you for contacting us!
//         </p>
//       )}
//     </form>
//   )
// }
