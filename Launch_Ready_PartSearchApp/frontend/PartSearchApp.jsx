import React, { useState, useEffect } from "react";

const allowedUsers = [
  { username: "admin", password: "admin123" },
  { username: "user1", password: "password1" }
];

const SignInPage = ({ onSignIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const foundUser = allowedUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (foundUser) {
      onSignIn();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#000", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ padding: "2rem", boxShadow: "0px 4px 10px rgba(255,255,255,0.2)", borderRadius: "1rem", backgroundColor: "#111", width: "300px" }}>
        <img src="/logo.png" alt="Logo" style={{ width: "80px", margin: "0 auto 1rem", display: "block" }} />
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>Sign In</h1>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <button onClick={handleSubmit} style={{ width: "100%", padding: "0.5rem", backgroundColor: "#fff", color: "#000", border: "none" }}>
          Log In
        </button>
      </div>
    </div>
  );
};

const PartSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) return setResults([]);
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching:", err);
        setResults([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, [query]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Search Part Number</h2>
        <input
          placeholder="Enter part number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        {loading && <p style={{ color: "gray" }}>Searching...</p>}
        {results.length === 0 && query && !loading && <p style={{ color: "gray" }}>No matching parts found.</p>}
        <div>
          {results.map((item, i) => (
            <div key={i} style={{ border: "1px solid #666", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1rem" }}>
              <p><strong>Part Number:</strong> {item.part}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> ${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function PartSearchApp() {
  const [signedIn, setSignedIn] = useState(false);
  return signedIn ? <PartSearch /> : <SignInPage onSignIn={() => setSignedIn(true)} />;
}
