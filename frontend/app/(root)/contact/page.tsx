export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-4xl font-bold">Contact</h1>

      <p className="text-gray-700">
        Have questions, feedback, or suggestions? Feel free to reach out.
      </p>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows={5}
            placeholder="Write your message here..."
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Send Message
        </button>
      </form>

      <div className="border-t pt-6 text-sm text-gray-500">
        <p>Email: contact@booknest.com</p>
        <p>Location: India</p>
      </div>
    </div>
  );
}
