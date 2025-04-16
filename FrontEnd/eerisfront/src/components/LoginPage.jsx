return (
  <div className="login-container">
    <form className="login-box" onSubmit={handleLogin}>
      <h2>LOG IN</h2>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">LOG IN</button>
    </form>
  </div>
);


