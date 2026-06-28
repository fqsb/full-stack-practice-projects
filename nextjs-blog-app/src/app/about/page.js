export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">About</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Blog System</h2>
            <p className="text-gray-600 mb-4">
              This is a modern blog demo built with Next.js. It supports article lists,
              Markdown rendering, categories, tags, and local mock comments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tech Stack</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>React and Next.js</li>
              <li>Tailwind CSS</li>
              <li>React Markdown</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact</h2>
            <p className="text-gray-600">
              Replace this section with your public contact information before deployment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
