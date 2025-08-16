import './App.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Hello Tailwind + React + Vite
        </h1>
        <p className="text-gray-600">
          Your client page is alive and ready for styling!
        </p>
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}